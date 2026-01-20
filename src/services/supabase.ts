import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { CreditCardProps } from '@/components/CreditCard';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;

// Test helper: expose a setter only during tests via globalThis to avoid exporting test-only symbols
// (Vitest runs with import.meta.env.MODE === 'test').
if (import.meta.env.MODE === 'test') {
  (globalThis as any).__setSupabaseClient = (client: SupabaseClient | null) => {
    supabase = client;
  };
}

export const getSupabase = (): SupabaseClient | null => {
  // If a client instance was injected (by global test helper), return it first.
  if (supabase) return supabase;
  if (!url || !key) return null;
  supabase = createClient(url, key);
  return supabase;
};

const getUserUid = async (sb: SupabaseClient): Promise<string | null> => {
  const { data, error } = await sb.auth.getUser();
  if (error) throw error;
  return (data?.user?.id ?? null) as string | null;
};

// Helpers for `cards` table updated to work with RLS + `auth_uid`.
// Reads/Inserts will require a user context (either `userId` or an authenticated `auth_uid`).
export const sbGetCards = async (userId?: number): Promise<CreditCardProps[] | null> => {
  const sb = getSupabase();
  if (!sb) return null;
  const uid = await getUserUid(sb);

  // Defensive: do not perform an unscoped read that could return all rows.
  if (!userId && !uid) {
    throw new Error('Sem contexto de usuário para buscar cartões (forneça userId ou autentique o usuário)');
  }

  let query = sb.from('cards').select('*').order('id', { ascending: true });
  if (userId) query = query.eq('user_id', userId);
  else query = query.eq('auth_uid', uid as string);

  const { data, error } = await query;
  if (error) throw error;
  return data as CreditCardProps[];
};

export const sbCreateCard = async (
  userId: number | null,
  payload: Partial<CreditCardProps>
): Promise<CreditCardProps | null> => {
  const sb = getSupabase();
  if (!sb) return null;
  const uid = await getUserUid(sb);

  // Require a user context for inserts to avoid orphan rows.
  if (!userId && !uid) {
    throw new Error('Usuário não autenticado: não é possível criar cartão sem associação a um usuário');
  }

  const row: any = { payload };
  if (userId) row.user_id = userId;
  if (uid) row.auth_uid = uid;

  const { data, error } = await sb.from('cards').insert([row]).select().single();
  if (error) throw error;
  return data as CreditCardProps;
};

export const sbUpdateCard = async (cardId: number, updates: Partial<CreditCardProps>): Promise<CreditCardProps | null> => {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from('cards').update({ payload: updates }).eq('id', cardId).select().single();
  if (error) throw error;
  return data as CreditCardProps;
};

export const sbDeleteCard = async (cardId: number): Promise<boolean | null> => {
  const sb = getSupabase();
  if (!sb) return null;
  const { error } = await sb.from('cards').delete().eq('id', cardId);
  if (error) throw error;
  return true;
};

export default getSupabase;
