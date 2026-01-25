import React, { createContext, useContext, useState } from 'react';

export type Transaction = {
  id: number;
  name: string;
  amount: number; // positivo = entrada, negativo = saída
  category?: string;
  date?: string;
  description?: string;
};

const initialTransactions: Transaction[] = [
  { id: 1, name: 'Supermercado Silva', amount: -342.5, description: 'Compra no débito', date: new Date().toISOString(), category: 'Alimentação' },
  { id: 2, name: 'Salário Mensal', amount: 4500.0, description: 'Pix Recebido', date: new Date().toISOString(), category: 'Salário' },
  { id: 3, name: 'Netflix', amount: -55.9, description: 'Assinatura', date: new Date().toISOString(), category: 'Assinatura' },
  { id: 4, name: 'Posto Shell', amount: -120.0, description: 'Combustível', date: new Date().toISOString(), category: 'Transporte' },
];

type ContextValue = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction?: (id: number) => void;
  clearTransactions?: () => void;
};

const TransactionsContext = createContext<ContextValue | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addTransaction = (t: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...t,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const removeTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((x) => x.id !== id));
  };

  const clearTransactions = () => setTransactions([]);

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, removeTransaction, clearTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionsProvider');
  return ctx;
};
