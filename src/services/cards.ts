import { CreditCardProps, Transaction } from "@/components/CreditCard";
import { cards as initialCards } from "../data/cards";
import { getSupabase, sbGetCards, sbCreateCard, sbUpdateCard, sbDeleteCard } from "./supabase";

let currentUserId: number | null = null;

export const setUserId = (userId: number | null) => {
  currentUserId = userId;
};

const getStorageKey = (): string => {
  if (!currentUserId) throw new Error("userId não está definido");
  return `cards_data_v1_user_${currentUserId}`;
};

const loadStorage = (): CreditCardProps[] => {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return initialCards;
    return JSON.parse(raw) as CreditCardProps[];
  } catch (e) {
    return initialCards;
  }
};

const saveStorage = (data: CreditCardProps[]) => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(data));
  } catch (e) {
    // ignore
  }
};

const hasSupabase = () => !!getSupabase();

export const getAll = async (): Promise<CreditCardProps[]> => {
  if (hasSupabase() && currentUserId) {
    try {
      const data = await sbGetCards(currentUserId);
      if (data) return data as CreditCardProps[];
    } catch (e) {
      // fallback to local
    }
  }
  return loadStorage();
};

export const getById = async (id: number): Promise<CreditCardProps | undefined> => {
  const list = await getAll();
  return list.find((c) => c.id === id);
};

export const create = async (card: Omit<CreditCardProps, "id" | "transactions" | "invoice"> & { invoice?: CreditCardProps["invoice"] }) => {
  if (hasSupabase() && currentUserId) {
    return await sbCreateCard(currentUserId, card);
  }
  const list = loadStorage();
  const id = list.reduce((m, c) => Math.max(m, c.id), 0) + 1;
  const newCard: CreditCardProps = {
    id,
    transactions: [],
    invoice: card.invoice ?? { total: 0, dueDate: "", history: [] },
    used: 0,
    cvv: card.cvv ?? "",
    ...card,
  } as CreditCardProps;
  list.push(newCard);
  saveStorage(list);
  return newCard;
};

export const update = async (id: number, updates: Partial<CreditCardProps>) => {
  if (hasSupabase()) {
    return await sbUpdateCard(id, updates);
  }
  const list = loadStorage();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  saveStorage(list);
  return list[idx];
};

export const remove = async (id: number) => {
  if (hasSupabase()) {
    return await sbDeleteCard(id);
  }
  let list = loadStorage();
  list = list.filter((c) => c.id !== id);
  saveStorage(list);
};

export const addTransaction = (cardId: number, tx: Omit<Transaction, "id">) => {
  const list = loadStorage();
  const card = list.find((c) => c.id === cardId);
  if (!card) return null;
  const txId = card.transactions?.reduce((m, t) => Math.max(m, t.id), 0) ?? 0;
  const newTx: Transaction = { id: txId + 1, ...tx };
  card.transactions = [...(card.transactions ?? []), newTx];
  card.used = (card.used ?? 0) + newTx.amount;
  saveStorage(list);
  // background sync to Supabase if available
  if (hasSupabase()) {
    const sb = getSupabase();
    (async () => {
      try {
        // attempt to update full card payload
        await sbUpdateCard(card.id, card);
      } catch (e) {
        // ignore
      }

      try {
        // Also create a global `transactions` row so realtime + global lists update
        const userResp = await sb.auth.getUser?.();
        const uid = userResp?.data?.user?.id ?? null;
        await sb.from('transactions').insert([{ name: newTx.name, amount: newTx.amount, category: newTx.category, description: newTx.description, date: new Date().toISOString(), auth_uid: uid }]);
      } catch (e) {
        // ignore insert errors
      }
    })();
  }
  return newTx;
};

export const removeTransaction = (cardId: number, txId: number) => {
  const list = loadStorage();
  const card = list.find((c) => c.id === cardId);
  if (!card) return;
  card.transactions = (card.transactions ?? []).filter((t) => t.id !== txId);
  saveStorage(list);
  if (hasSupabase()) {
    (async () => {
      try {
        await sbUpdateCard(card.id, card);
      } catch (e) {
        // ignore
      }
    })();
  }
};

export default { getAll, getById, create, update, remove, addTransaction, removeTransaction };
