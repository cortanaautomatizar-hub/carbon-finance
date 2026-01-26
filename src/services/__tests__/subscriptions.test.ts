import { describe, it, expect, beforeEach } from 'vitest';
import * as subs from '../subscriptions';

beforeEach(() => {
  localStorage.clear();
});

describe('subscriptions storage helpers', () => {
  it('returns empty array when none saved', () => {
    expect(subs.getAllSubscriptions()).toEqual([]);
  });

  it('can save and retrieve subscriptions', () => {
    const s = subs.addSubscription({ name: 'Netflix', amount: 29.9 });
    expect(s.id).toBe(1);
    const all = subs.getAllSubscriptions();
    expect(all.length).toBe(1);
    expect(all[0].name).toBe('Netflix');
  });

  it('updateSubscription updates existing and returns it', () => {
    const s = subs.addSubscription({ name: 'Spotify', amount: 9.9 });
    const updated = subs.updateSubscription({ ...s, amount: 8.5 });
    expect(updated).not.toBeNull();
    expect(updated?.amount).toBe(8.5);
  });

  it('removeSubscription removes and returns removed item', () => {
    const s = subs.addSubscription({ name: 'HBO', amount: 19.9 });
    const removed = subs.removeSubscription(s.id);
    expect(removed).not.toBeNull();
    expect(subs.getAllSubscriptions().length).toBe(0);
  });

  it('service colors can be set, retrieved and removed', () => {
    subs.setServiceColor('Netflix', '#ff0000');
    expect(subs.getServiceColors().Netflix).toBe('#ff0000');

    subs.removeServiceColor('Netflix');
    expect(subs.getServiceColors().Netflix).toBeUndefined();
  });

  it('addSubscription swallows background sync errors', async () => {
    // inject supabase client that will throw when trying to insert
    const mockClient: any = {
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: 'u1' } } })) },
      from: () => ({ insert: () => Promise.reject(new Error('insert fail')) })
    };
    (globalThis as unknown as { __setSupabaseClient?: (c: unknown) => void }).__setSupabaseClient?.(mockClient);

    const s = subs.addSubscription({ name: 'FailService', amount: 1 });
    expect(s.id).toBeGreaterThan(0);
    // Wait for background attempt to run
    await new Promise((r) => setTimeout(r, 20));

    // no throw and it remains saved locally
    const all = subs.getAllSubscriptions();
    expect(all.some(a => a.name === 'FailService')).toBeTruthy();
  });
});