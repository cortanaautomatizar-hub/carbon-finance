import { describe, it, expect, vi, afterEach } from 'vitest';
import * as svc from '../supabase';

afterEach(() => {
  vi.restoreAllMocks();
  (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(null);
});

describe('supabase service error handling', () => {
  it('throws when auth.getUser returns error', async () => {
    const mockClient: any = {
      auth: { getUser: vi.fn(async () => ({ data: null, error: new Error('auth fail') })) },
      from: () => ({ select: () => ({ order: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }) }) })
    };
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    await expect(svc.sbGetCards(1)).rejects.toThrow('auth fail');
  });

  it('throws when query returns an error for sbGetCards', async () => {
    const mockClient: any = {
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: 'u1' } }, error: null })) },
      from: () => ({ select: () => ({ order: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('db read') }) }) }) })
    };
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    await expect(svc.sbGetCards(123)).rejects.toThrow('db read');
  });

  it('throws when insert returns an error for sbCreateCard', async () => {
    const mockClient: any = {
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: 'u1' } }, error: null })) },
      from: () => ({ insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('insert fail') }) }) }) })
    };
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    await expect(svc.sbCreateCard(1, { name: 'X' })).rejects.toThrow('insert fail');
  });

  it('throws when update returns an error for sbUpdateCard', async () => {
    const mockClient: any = {
      from: () => ({ update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('update fail') }) }) }) }) })
    };
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    await expect(svc.sbUpdateCard(1, { name: 'x' })).rejects.toThrow('update fail');
  });

  it('throws when delete returns an error for sbDeleteCard', async () => {
    const mockClient: any = {
      from: () => ({ delete: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('delete fail') }) }) })
    };
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    await expect(svc.sbDeleteCard(1)).rejects.toThrow('delete fail');
  });
});
