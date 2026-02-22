import { describe, it, expect, beforeEach, vi } from 'vitest';
import cardsService from '../cards';
import type { CreditCardProps } from '@/components/CreditCard';

// helper to remove storage key
const clearStorage = () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('cards_data_v1_user_'));
  keys.forEach(k => localStorage.removeItem(k));
};

// force a fake user so service doesn't throw
beforeEach(() => {
  clearStorage();
  cardsService.setUserId(1);
});

describe('cards service local logic', () => {
  it('payInvoice should reset used/transactions and add history entry', async () => {
    // create a simple card with some used/invoice
    const card: Omit<CreditCardProps, 'id' | 'transactions' | 'invoice'> & { invoice?: CreditCardProps['invoice'] } = {
      name: 'Test',
      number: '0000',
      expiry: '01/30',
      cvv: '000',
      brand: 'visa',
      limit: 1000,
      color: '#000',
      textColor: '#fff',
      dueDay: 1,
      closingDay: 1,
      used: 500,
      transactions: [{ id: 1, description: 'x', amount: 500, date: '2025-01-01' }],
      invoice: { total: 500, dueDate: '01/02/2025', history: [] },
    } as any;

    const created = await cardsService.create(card as any);
    expect(created.used).toBe(0); // create resets used

    // manually update to have some used + transactions so payInvoice can act
    const updatedCard = await cardsService.update(created.id, {
      used: 500,
      transactions: [{ id: 1, description: 'x', amount: 500, date: '2025-01-01' }],
      invoice: { total: 500, dueDate: '01/02/2025', history: [] },
    });

    expect(updatedCard).not.toBeNull();
    const before = updatedCard as CreditCardProps;
    expect(before.invoice.total).toBe(500);

    const paid = await cardsService.payInvoice(created.id);
    expect(paid).not.toBeNull();
    if (paid) {
      expect(paid.used).toBe(0);
      expect(paid.transactions).toHaveLength(0);
      expect(paid.invoice.total).toBe(0);
      expect(paid.invoice.history).toHaveLength(1);
      expect(paid.invoice.history[0].status).toBe('paga');
    }
  });

  it('onChange listeners are invoked when cards mutate', async () => {
    const spy = vi.fn();
    const unsubscribe = cardsService.onChange(spy);

    const c = await cardsService.create({
      name: 'Foo',
      number: '1111',
      expiry: '02/29',
      cvv: '111',
      brand: 'visa',
      limit: 100,
      color: '#000',
      textColor: '#fff',
      dueDay: 1,
      closingDay: 1,
    } as any);
    expect(spy).toHaveBeenCalled();

    spy.mockClear();
    await cardsService.update(c.id, { name: 'Bar' });
    expect(spy).toHaveBeenCalled();

    spy.mockClear();
    await cardsService.payInvoice(c.id);
    expect(spy).toHaveBeenCalled();

    unsubscribe();
    spy.mockClear();
    await cardsService.update(c.id, { name: 'Baz' });
    expect(spy).not.toHaveBeenCalled();
  });
});
