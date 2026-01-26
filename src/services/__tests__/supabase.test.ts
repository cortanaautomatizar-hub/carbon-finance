import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as svc from '../supabase';
import type { CreditCardProps } from '@/components/CreditCard';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('supabase service defensive behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    ((globalThis as unknown) as { __setSupabaseClient?: (c: SupabaseClient | null) => void }).__setSupabaseClient?.(null);
  });

  it('sbGetCards throws when no userId and no authenticated uid', async () => {
    // Inject a mock client whose auth.getUser returns no user
    const mockClient = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
    } as unknown as SupabaseClient;
    ((globalThis as unknown) as { __setSupabaseClient?: (c: SupabaseClient | null) => void }).__setSupabaseClient?.(mockClient);

    await expect(svc.sbGetCards()).rejects.toThrow(/Sem contexto de usuário/);
  });

  it('sbCreateCard throws when no user context (uid or userId)', async () => {
    const mockClient = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
    } as unknown as SupabaseClient;
    ((globalThis as unknown) as { __setSupabaseClient?: (c: SupabaseClient | null) => void }).__setSupabaseClient?.(mockClient);

    await expect(svc.sbCreateCard(null, { name: 'x' } as Partial<CreditCardProps>)).rejects.toBeInstanceOf(svc.UserContextError);
  });

  it('sbGetCards throws SupabaseUnavailableError when client not configured', async () => {
    ((globalThis as unknown) as { __setSupabaseClient?: (c: SupabaseClient | null) => void }).__setSupabaseClient?.(null);
    await expect(svc.sbGetCards(1)).rejects.toBeInstanceOf(svc.SupabaseUnavailableError);
  });

  it('sbCreateCard throws SupabaseUnavailableError when client not configured', async () => {
    ((globalThis as unknown) as { __setSupabaseClient?: (c: SupabaseClient | null) => void }).__setSupabaseClient?.(null);
    await expect(svc.sbCreateCard(1, { name: 'X' } as Partial<CreditCardProps>)).rejects.toBeInstanceOf(svc.SupabaseUnavailableError);
  });

  it('sbGetCards returns data when userId provided', async () => {
    const rows: CreditCardProps[] = [
      { id: 1, name: 'Card A', number: '0000', expiry: '12/30', cvv: '123', brand: 'VISA', limit: 1000, used: 0, color: '#000', textColor: '#fff', invoice: { total: 0, dueDate: '', history: [] } }
    ];

    const mockClient = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
      from: () => ({
        select: () => ({
          order: () => ({
            eq: () => Promise.resolve({ data: rows, error: null })
          })
        })
      })
    } as unknown as SupabaseClient;

    ((globalThis as unknown) as { __setSupabaseClient?: (c: SupabaseClient | null) => void }).__setSupabaseClient?.(mockClient);

    const res = await svc.sbGetCards(123);
    expect(res).toEqual(rows);
  });

  it('sbCreateCard inserts and returns created card when userId provided', async () => {
    const created = { id: 10, payload: { name: 'New' } } as unknown as { id: number; payload: Partial<CreditCardProps> };
    const mockClient = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
      from: () => ({
        insert: () => ({
          select: () => ({ single: () => Promise.resolve({ data: created, error: null }) })
        })
      })
    } as unknown as SupabaseClient;

    ((globalThis as unknown) as { __setSupabaseClient?: (c: SupabaseClient | null) => void }).__setSupabaseClient?.(mockClient);

    const res = await svc.sbCreateCard(1, { name: 'New' } as Partial<CreditCardProps>);
    expect(res).toEqual(created);
  });
});
