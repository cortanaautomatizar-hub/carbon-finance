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
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: UserRecord[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
};

const generateToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const register = (payload: { name: string; email: string; phone?: string; password: string }) => {
  const users = loadUsers();
  const exists = users.find(u => u.email === payload.email || (payload.phone && u.phone === payload.phone));
  if (exists) throw new Error('Usuário já cadastrado com esse e-mail/telefone');

  const id = users.reduce((m, u) => Math.max(m, u.id), 0) + 1;
  const user: UserRecord = { id, ...payload } as UserRecord;
  users.push(user);
  saveUsers(users);

  const token = generateToken();
  return { user: { id: user.id, name: user.name, email: user.email, phone: user.phone }, token };
};

export const login = (identifier: string, password: string) => {
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
