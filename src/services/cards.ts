import { CreditCardProps, Transaction } from "@/components/CreditCard";
import { cards as initialCards } from "@/data/cards";

const STORAGE_KEY = "cards_data_v1";

const loadStorage = (): CreditCardProps[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialCards;
    return JSON.parse(raw) as CreditCardProps[];
  } catch (e) {
    return initialCards;
  }
};

const saveStorage = (data: CreditCardProps[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
};

export const getAll = (): CreditCardProps[] => {
  return loadStorage();
};

export const getById = (id: number): CreditCardProps | undefined => {
  return loadStorage().find((c) => c.id === id);
};

export const create = (card: Omit<CreditCardProps, "id" | "transactions" | "invoice"> & { invoice?: CreditCardProps["invoice"] }) => {
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

export const update = (id: number, updates: Partial<CreditCardProps>) => {
  const list = loadStorage();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  saveStorage(list);
  return list[idx];
};

export const remove = (id: number) => {
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
  return newTx;
};

export const removeTransaction = (cardId: number, txId: number) => {
  const list = loadStorage();
  const card = list.find((c) => c.id === cardId);
  if (!card) return;
  card.transactions = (card.transactions ?? []).filter((t) => t.id !== txId);
  saveStorage(list);
};

export default { getAll, getById, create, update, remove, addTransaction, removeTransaction };
