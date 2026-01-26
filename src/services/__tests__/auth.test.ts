import { describe, it, expect, beforeEach } from 'vitest';
import * as auth from '../auth';

beforeEach(() => {
  localStorage.clear();
});

describe('auth local flow', () => {
  it('registers a new user locally and returns token', async () => {
    const res = await auth.register({ name: 'Test', email: 't1@example.com', password: 'pass' });
    expect(res.user.email).toBe('t1@example.com');
    expect(res.token).toBeTruthy();
  });

  it('register throws when user already exists', async () => {
    await auth.register({ name: 'Test', email: 't2@example.com', password: 'pass' });
    await expect(auth.register({ name: 'Test', email: 't2@example.com', password: 'pass' })).rejects.toThrow(/Usuário já cadastrado/);
  });

  it('login succeeds with valid credentials', async () => {
    await auth.register({ name: 'L', email: 'login@example.com', password: 'pwd' });
    const res = await auth.login('login@example.com', 'pwd');
    expect(res.token).toBeTruthy();
    expect(res.user.email).toBe('login@example.com');
  });

  it('login fails for unknown user', async () => {
    await expect(auth.login('noone@example.com', 'x')).rejects.toThrow(/Usuário não encontrado/);
  });

  it('login fails for wrong password', async () => {
    await auth.register({ name: 'P', email: 'pw@example.com', password: 'secret' });
    await expect(auth.login('pw@example.com', 'wrong')).rejects.toThrow(/Senha inválida/);
  });

  it('register delegates to supabase signUp when supabase available', async () => {
    const mockClient: any = { auth: { signUp: vi.fn(async () => ({ data: { user: { id: 'u1' } }, error: null })) } };
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    const res = await auth.register({ name: 'Sup', email: 'sup@example.com', password: 'p' });
    expect(res.user).toBeDefined();
  });

  it('login delegates to supabase signInWithPassword when supabase available', async () => {
    const mockClient: any = { auth: { signInWithPassword: vi.fn(async () => ({ data: { session: { access_token: 't', user: { id: 'u1', email: 's@e', user_metadata: { name: 'S', phone: 'p' } } } }, error: null })) } };
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    const res = await auth.login('s@e', 'p');
    expect(res.token).toBeTruthy();
    expect(res.user.email).toBe('s@e');
  });
});