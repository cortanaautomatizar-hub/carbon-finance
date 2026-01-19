import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!url || !key) return null;
  if (!supabase) supabase = createClient(url, key);
  return supabase;
};

const getUserUid = async (sb: SupabaseClient) => {
  const { data, error } = await sb.auth.getUser();
  if (error) throw error;
  return (data?.user?.id ?? null) as string | null;
};

// Helpers for `cards` table updated to work with RLS + `auth_uid`.
// Inserts populate `auth_uid` from the authenticated user; reads use `auth_uid` when possible.
export const sbGetCards = async (userId?: number) => {
  const sb = getSupabase();
  if (!sb) return null;
  const uid = await getUserUid(sb);
  let query: any = sb.from('cards').select('*').order('id', { ascending: true });
  if (userId) query = query.eq('user_id', userId);
  else if (uid) query = query.eq('auth_uid', uid);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const sbCreateCard = async (userId: number | null, payload: any) => {
  const sb = getSupabase();
  if (!sb) return null;
  const uid = await getUserUid(sb);
  const row: any = { payload };
  if (userId) row.user_id = userId;
  if (uid) row.auth_uid = uid;
  const { data, error } = await sb.from('cards').insert([row]).select().single();
  if (error) throw error;
  return data;
};

export const sbUpdateCard = async (cardId: number, updates: any) => {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from('cards').update({ payload: updates }).eq('id', cardId).select().single();
  if (error) throw error;
  return data;
};

export const sbDeleteCard = async (cardId: number) => {
  const sb = getSupabase();
  if (!sb) return null;
  const { error } = await sb.from('cards').delete().eq('id', cardId);
  if (error) throw error;
  return true;
};

export default getSupabase;
