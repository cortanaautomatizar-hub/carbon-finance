import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as supabase from '../supabase';
import { cards as initialCards } from '../../data/cards';

// Ensure module alias '@/data/cards' is available during tests
vi.mock('@/data/cards', () => ({ cards: initialCards }));

import * as cards from '../cards';

beforeEach(() => {
  localStorage.clear();
  cards.setUserId(null);
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('cards service (local fallback)', () => {
  it('creates a card and returns a new id when no supabase (local fallback)', async () => {
    const newCard = await cards.create({ name: 'Local Card', number: '1111', expiry: '01/30', brand: 'VISA', color: '#000', textColor: '#fff' });
    expect(newCard.id).toBeGreaterThan(0);

    // When userId is not set, saveStorage silently fails; ensure id was correctly computed from initial data
    // initialCards may be mutated by module operations; just verify a valid id was generated
    expect(typeof newCard.id).toBe('number');
    expect(newCard.id).toBeGreaterThan(0);
  });

  it('getAll returns supabase data when available and userId set', async () => {
    const rows = [{ id: 99, name: 'Remote', number: '2222', expiry: '12/30', cvv: '000', brand: 'MC', limit: 100, used: 0, color: '#000', textColor: '#fff', invoice: { total: 0, dueDate: '', history: [] } }];

    // Inject supabase client that returns rows
    const mockClient: any = {
      auth: { getUser: vi.fn(async () => ({ data: { user: null }, error: null })) },
      from: () => ({ select: () => ({ order: () => ({ eq: () => Promise.resolve({ data: rows, error: null }) }) }) })
    };

    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);
    cards.setUserId(1);

    const res = await cards.getAll();
    expect(res).toEqual(rows);
  });

  it('getAll falls back to localStorage when sbGetCards throws', async () => {
    // Prepare local storage with a sentinel
    const sentinel = [{ id: 5, name: 'LocalOnly', number: '3333', expiry: '01/31', cvv: '000', brand: 'VISA', limit: 0, used: 0, color: '#000', textColor: '#fff', invoice: { total: 0, dueDate: '', history: [] } }];
    localStorage.setItem('cards_data_v1_user_1', JSON.stringify(sentinel));

    cards.setUserId(1);
    const spy = vi.spyOn(supabase, 'sbGetCards').mockImplementation(async () => { throw new Error('boom'); });

    const res = await cards.getAll();
    expect(res).toEqual(sentinel);
    spy.mockRestore();
  });

  it('addTransaction updates local card and returns transaction', () => {
    // seed localStorage with initial cards (id 1)
    localStorage.setItem('cards_data_v1_user_1', JSON.stringify(initialCards));
    cards.setUserId(1);

    const tx = { name: 'Coffee', amount: 5.5, category: 'food', description: '' };
    const added = cards.addTransaction(1, tx as any);
    expect(added).toHaveProperty('id');
    // ensure local storage updated
    const stored = JSON.parse(localStorage.getItem('cards_data_v1_user_1') as string);
    const card = stored.find((c: any) => c.id === 1);
    expect(card.transactions.some((t: any) => t.name === 'Coffee')).toBeTruthy();
  });

  it('update returns null when id not found', async () => {
    // local path (no supabase)
    localStorage.setItem('cards_data_v1_user_1', JSON.stringify(initialCards));
    cards.setUserId(1);
    // Ensure supabase client is not present to exercise local path
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(null);
    const res = await cards.update(9999, { name: 'Nope' });
    expect(res).toBeNull();
  });

  it('removeTransaction is a no-op when card not found', () => {
    localStorage.setItem('cards_data_v1_user_1', JSON.stringify(initialCards));
    // ensure no throw
    expect(() => cards.removeTransaction(9999, 1)).not.toThrow();
  });

  it('addTransaction swallows background sync errors when Supabase fails', async () => {
    localStorage.setItem('cards_data_v1_user_1', JSON.stringify(initialCards));
    cards.setUserId(1);

    const mockClient: any = {
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: 'u1' } }, error: null })) },
      from: (table: string) => {
        if (table === 'cards') {
          return { update: () => ({ eq: () => ({ select: () => Promise.resolve({ data: {}, error: null }) }) }) };
        }
        if (table === 'transactions') {
          return { insert: () => Promise.reject(new Error('insert fail')) };
        }
        return {};
      }
    };

    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    const tx = { name: 'ErrorTx', amount: 1.0, category: 'misc', description: '' };
    const added = cards.addTransaction(1, tx as any);
    expect(added).toHaveProperty('id');
    // wait a tick so background IIFE runs and errors (if any) are swallowed
    await new Promise((r) => setTimeout(r, 20));

    // no throw and local storage remains updated
    const stored = JSON.parse(localStorage.getItem('cards_data_v1_user_1') as string);
    const card = stored.find((c: any) => c.id === 1);
    expect(card.transactions.some((t: any) => t.name === 'ErrorTx')).toBeTruthy();
  });

  it('getAll returns initial cards when localStorage empty and userId set (loadStorage branch)', async () => {
    localStorage.clear();
    cards.setUserId(1);
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(null);
    const res = await cards.getAll();
    expect(res).toEqual(initialCards);
  });

  it('getById returns a card from local storage', async () => {
    localStorage.setItem('cards_data_v1_user_1', JSON.stringify(initialCards));
    const res = await cards.getById(1);
    expect(res).toBeDefined();
    expect(res?.id).toBe(1);
  });

  it('create delegates to sbCreateCard when Supabase available and userId set', async () => {
    const created = { id: 999, name: 'RemoteCreated' } as any;
    const spy = vi.spyOn(await import('../supabase'), 'sbCreateCard').mockResolvedValue(created);
    cards.setUserId(1);
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.({});

    const res = await cards.create({ name: 'Remote', number: '0000', expiry: '01/30', brand: 'VISA', color: '#000', textColor: '#fff' } as any);
    expect(res).toEqual(created);
    spy.mockRestore();
  });
});
