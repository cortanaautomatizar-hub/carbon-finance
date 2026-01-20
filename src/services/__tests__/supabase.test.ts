import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as svc from '../supabase';
import type { CreditCardProps } from '@/components/CreditCard';

describe('supabase service defensive behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    svc.__setSupabaseClient(null);
  });

  it('sbGetCards throws when no userId and no authenticated uid', async () => {
    // Inject a mock client whose auth.getUser returns no user
    const mockClient: any = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
    };
    svc.__setSupabaseClient(mockClient);

    await expect(svc.sbGetCards()).rejects.toThrow(/Sem contexto de usuário/);
  });

  it('sbCreateCard throws when no user context (uid or userId)', async () => {
    const mockClient: any = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
    };
    svc.__setSupabaseClient(mockClient);

    await expect(svc.sbCreateCard(null, { name: 'x' } as Partial<CreditCardProps>)).rejects.toThrow(/Usuário não autenticado/);
  });

  it('sbGetCards returns data when userId provided', async () => {
    const rows: CreditCardProps[] = [
      { id: 1, name: 'Card A', number: '0000', expiry: '12/30', cvv: '123', brand: 'VISA', limit: 1000, used: 0, color: '#000', textColor: '#fff', invoice: { total: 0, dueDate: '', history: [] } }
    ];

    const mockClient: any = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
      from: () => ({
        select: () => ({
          order: () => ({
            eq: () => Promise.resolve({ data: rows, error: null })
          })
        })
      })
    };

    svc.__setSupabaseClient(mockClient);

    const res = await svc.sbGetCards(123);
    expect(res).toEqual(rows);
  });

  it('sbCreateCard inserts and returns created card when userId provided', async () => {
    const created: any = { id: 10, payload: { name: 'New' } };
    const mockClient: any = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
      from: () => ({
        insert: () => ({
          select: () => ({ single: () => Promise.resolve({ data: created, error: null }) })
        })
      })
    };

    svc.__setSupabaseClient(mockClient);

    const res = await svc.sbCreateCard(1, { name: 'New' } as Partial<CreditCardProps>);
    expect(res).toEqual(created);
  });
});
