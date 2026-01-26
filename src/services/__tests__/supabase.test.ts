import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as svc from '../supabase';
import type { CreditCardProps } from '@/components/CreditCard';

interface MockAuth { getUser: () => Promise<{ data: { user: unknown } }>; }
interface MockFrom { select?: () => { order?: () => { eq?: () => Promise<{ data: CreditCardProps[] | unknown; error: unknown }> } }; insert?: () => { select?: () => { single?: () => Promise<{ data: unknown; error: unknown }> } } }
type MockClient = { auth: MockAuth; from?: (table: string) => MockFrom; };

describe('supabase service defensive behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(null);
  });

  it('sbGetCards throws when no userId and no authenticated uid', async () => {
    // Inject a mock client whose auth.getUser returns no user
    const mockClient: Partial<MockClient> = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
    };
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    await expect(svc.sbGetCards()).rejects.toThrow(/Sem contexto de usuário/);
  });

  it('sbCreateCard throws when no user context (uid or userId)', async () => {
    const mockClient: Partial<MockClient> = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
    };
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    await expect(svc.sbCreateCard(null, { name: 'x' } as Partial<CreditCardProps>)).rejects.toBeInstanceOf(svc.UserContextError);
  });

  it('sbGetCards throws SupabaseUnavailableError when client not configured', async () => {
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(null);
    await expect(svc.sbGetCards(1)).rejects.toBeInstanceOf(svc.SupabaseUnavailableError);
  });

  it('sbCreateCard throws SupabaseUnavailableError when client not configured', async () => {
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(null);
    await expect(svc.sbCreateCard(1, { name: 'X' } as Partial<CreditCardProps>)).rejects.toBeInstanceOf(svc.SupabaseUnavailableError);
  });

  it('sbGetCards returns data when userId provided', async () => {
    const rows: CreditCardProps[] = [
      { id: 1, name: 'Card A', number: '0000', expiry: '12/30', cvv: '123', brand: 'VISA', limit: 1000, used: 0, color: '#000', textColor: '#fff', invoice: { total: 0, dueDate: '', history: [] } }
    ];

    const mockClient: Partial<MockClient> = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
      from: () => ({
        select: () => ({
          order: () => ({
            eq: () => Promise.resolve({ data: rows, error: null })
          })
        })
      })
    };

    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    const res = await svc.sbGetCards(123);
    expect(res).toEqual(rows);
  });

  it('sbCreateCard inserts and returns created card when userId provided', async () => {
    const created = { id: 10, payload: { name: 'New' } };
    const mockClient: MockClient = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
      from: () => ({
        insert: () => ({
          select: () => ({ single: () => Promise.resolve({ data: created, error: null }) })
        })
      })
    };

    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    const res = await svc.sbCreateCard(1, { name: 'New' } as Partial<CreditCardProps>);
    expect(res).toEqual(created);
  });
});
