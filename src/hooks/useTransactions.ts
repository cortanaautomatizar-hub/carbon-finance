import { useEffect, useState, useCallback } from 'react';
import Decimal from 'decimal.js';
import getSupabase from '@/services/supabase';

export type TransactionRecord = {
  id: number;
  name?: string;
  amount: number; // numeric value in BRL (positive or negative)
  type?: 'income' | 'outcome';
  category?: string;
  date?: string;
  description?: string;
};

export type TransactionsStats = {
  income: number;
  outcome: number;
  total: number;
};

/**
 * Hook para gerenciar transações via Supabase (fetch + stats calculado com precisão decimal)
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const sb = getSupabase();
      if (!sb) {
        throw new Error('Supabase client is not configured');
      }

      const { data, error } = await sb
        .from<TransactionRecord>('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Defensive: ensure amounts are numbers and pick expected fields
      const normalized = (data ?? []).map((r: Record<string, unknown>) => ({
        id: typeof r['id'] === 'number' ? (r['id'] as number) : 0,
        name: typeof r['name'] === 'string' ? (r['name'] as string) : undefined,
        amount: typeof r['amount'] === 'string' ? parseFloat(r['amount'] as string) : typeof r['amount'] === 'number' ? (r['amount'] as number) : 0,
        type: typeof r['type'] === 'string' && (r['type'] === 'income' || r['type'] === 'outcome') ? (r['type'] as 'income' | 'outcome') : undefined,
        category: typeof r['category'] === 'string' ? (r['category'] as string) : undefined,
        date: typeof r['date'] === 'string' ? (r['date'] as string) : undefined,
        description: typeof r['description'] === 'string' ? (r['description'] as string) : undefined,
      })) as TransactionRecord[];

      setTransactions(normalized);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();

    // Optional: you could set up realtime listeners here to call fetchTransactions on changes
    // For now we just fetch on mount and expose `refresh` to callers
  }, [fetchTransactions]);

  // Calcular estatísticas com Decimal para evitar erros de ponto flutuante
  const stats = transactions.reduce(
    (acc, tx) => {
      const amt = new Decimal(tx.amount ?? 0);

      // prefer explicit type field when present
      const isIncome = tx.type ? tx.type === 'income' : amt.greaterThanOrEqualTo(0);

      if (isIncome) {
        acc.income = acc.income.plus(amt);
        acc.total = acc.total.plus(amt);
      } else {
        acc.outcome = acc.outcome.plus(amt.abs());
        acc.total = acc.total.minus(amt.abs());
      }

      return acc;
    },
    { income: new Decimal(0), outcome: new Decimal(0), total: new Decimal(0) } as {
      income: Decimal;
      outcome: Decimal;
      total: Decimal;
    }
  );

  const statsResult: TransactionsStats = {
    income: stats.income.toDecimalPlaces(2).toNumber(),
    outcome: stats.outcome.toDecimalPlaces(2).toNumber(),
    total: stats.total.toDecimalPlaces(2).toNumber(),
  };

  return { transactions, stats: statsResult, loading, error, refresh: fetchTransactions } as const;
}
