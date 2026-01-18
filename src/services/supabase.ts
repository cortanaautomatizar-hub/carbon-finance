import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!url || !key) return null;
  if (!supabase) supabase = createClient(url, key);
  return supabase;
};

// Basic helpers for cards table (expects a `cards` table with user_id foreign key)
export const sbGetCards = async (userId: number) => {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from('cards').select('*').eq('user_id', userId).order('id', { ascending: true });
  if (error) throw error;
  return data;
};

export const sbCreateCard = async (userId: number, payload: any) => {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from('cards').insert([{ user_id: userId, payload }]).select().single();
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
