import getSupabase from './supabase';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
}

const USERS_KEY = 'users_v1';

const loadUsers = (): UserRecord[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : getDefaultUsers();
  } catch {
    return getDefaultUsers();
  }
};

const getDefaultUsers = (): UserRecord[] => {
  return [
    {
      id: 1,
      name: "Usuário Teste",
      email: "teste@teste.com",
      phone: "+55 11 99999-9999",
      password: "teste123"
    }
  ];
};

const saveUsers = (users: UserRecord[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    // ignore storage errors
  }
};

const generateToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const register = async (payload: { name: string; email: string; phone?: string; password: string }) => {
  const sb = getSupabase();
  if (sb) {
    // Use Supabase signUp flow
    // @ts-expect-error - Supabase auth API allows dynamic metadata in options.data; strict typing not enforced in v2
    const { data, error } = await sb.auth.signUp({ email: payload.email, password: payload.password, options: { data: { name: payload.name, phone: payload.phone } } });
    if (error) throw error;
    const sbUser = data?.user ?? null;
    return { user: { id: sbUser?.id ?? null, name: payload.name, email: payload.email, phone: payload.phone }, token: null };
  }

  const users = loadUsers();
  const exists = users.find(u => u.email === payload.email || (payload.phone && u.phone === payload.phone));
  if (exists) throw new Error('Usuário já cadastrado com esse e-mail/telefone');
  const maxId = users.reduce((m, u) => Math.max(m, u.id), 0);
  const id = maxId + 1;
  const user: UserRecord = { id, ...payload } as UserRecord;
  users.push(user);
  saveUsers(users);
  const token = generateToken();
  return { user: { id: user.id, name: user.name, email: user.email, phone: user.phone }, token };
};

export const login = async (identifier: string, password: string) => {
  const sb = getSupabase();
  if (sb) {
    // use Supabase sign-in
    // @ts-expect-error - Supabase signInWithPassword may not be fully typed; best-effort invocation
    const { data, error } = await sb.auth.signInWithPassword({ email: identifier, password });
    if (error) throw error;
    const session = data?.session ?? null;
    const sbUser = session?.user ?? data?.user ?? null;
    const token = session?.access_token ?? null;
    return { user: { id: sbUser?.id ?? null, name: sbUser?.user_metadata?.name ?? sbUser?.email, email: sbUser?.email, phone: sbUser?.user_metadata?.phone }, token };
  }

  const users = loadUsers();
  const user = users.find(u => u.email === identifier || u.phone === identifier);
  if (!user) throw new Error('Usuário não encontrado');
  if (user.password !== password) throw new Error('Senha inválida');
  const token = generateToken();
  return { user: { id: user.id, name: user.name, email: user.email, phone: user.phone }, token };
};

export const findUserByEmail = (email: string) => loadUsers().find(u => u.email === email);

export const findUserByPhone = (phone: string) => loadUsers().find(u => u.phone === phone);

export default { register, login, findUserByEmail };
