import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useTransactions as useTransactionsHook, TransactionRecord, TransactionsStats } from '@/hooks/useTransactions';
import getSupabase from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';

export type Transaction = TransactionRecord;

type ContextValue = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id' | 'date'>) => Promise<any>;
  removeTransaction: (id: number) => Promise<boolean>;
  clearTransactions?: () => void;
  refresh: () => Promise<void>;
  loading: boolean;
  error: Error | null;
  stats: TransactionsStats;
};

const TransactionsContext = createContext<ContextValue | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { transactions, stats, loading, error, refresh } = useTransactionsHook();

  // Supabase realtime subscription: refresh on INSERT or DELETE in `transactions` table
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    let timeoutId: number | null = null;
    const scheduleRefresh = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        refresh();
        timeoutId = null;
      }, 200);
    };

    // Create a named channel for transactions and listen to INSERT/UPDATE/DELETE
    const channel = sb
      .channel('public:transactions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, scheduleRefresh)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'transactions' }, scheduleRefresh)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'transactions' }, scheduleRefresh)
      .subscribe();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      try {
        channel.unsubscribe();
      } catch {
        // ignore
      }
    };
  }, [refresh]);

  const addTransaction = useCallback(async (t: Omit<Transaction, 'id' | 'date'>) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client is not configured');

    const payload = {
      name: t.name,
      amount: t.amount,
      category: t.category,
      description: t.description,
      date: new Date().toISOString(),
    } as any;

    const { data, error } = await sb.from('transactions').insert([payload]).select().single();

    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível adicionar a transação', variant: 'destructive' });
      throw error;
    }

    // The realtime subscription will call refresh() automatically.
    return data;
  }, []);

  const removeTransaction = useCallback(async (id: number) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client is not configured');

    const { error } = await sb.from('transactions').delete().eq('id', id);

    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível remover a transação', variant: 'destructive' });
      return false;
    }

    // Realtime will refresh automatically
    return true;
  }, []);

  const clearTransactions = async () => {
    // Not implemented: clearing all transactions should be handled carefully server-side
    toast({ title: 'Não suportado', description: 'Limpar todas as transações não é suportado via UI.' });
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, removeTransaction, clearTransactions, refresh, loading, error, stats }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionsProvider');
  return ctx;
};
