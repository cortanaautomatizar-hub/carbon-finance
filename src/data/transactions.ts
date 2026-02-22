import { TransactionRecord } from '@/hooks/useTransactions';

export const demoTransactions: TransactionRecord[] = [
  {
    id: 1,
    name: 'Salário',
    amount: 5500.00,
    type: 'income',
    category: 'salário',
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    description: 'Salário mensal'
  },
  {
    id: 2,
    name: 'Freelance',
    amount: 1200.50,
    type: 'income',
    category: 'renda-extra',
    date: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
    description: 'Projeto desenvolvimento'
  },
  {
    id: 3,
    name: 'Aluguel',
    amount: -1500.00,
    type: 'outcome',
    category: 'moradia',
    date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    description: 'Aluguel do apartamento'
  },
  {
    id: 4,
    name: 'Supermercado',
    amount: -350.75,
    type: 'outcome',
    category: 'alimentação',
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    description: 'Compras no supermercado'
  },
  {
    id: 5,
    name: 'Uber',
    amount: -85.00,
    type: 'outcome',
    category: 'transporte',
    date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    description: 'Uber para o trabalho'
  },
  {
    id: 6,
    name: 'Netflix',
    amount: -39.90,
    type: 'outcome',
    category: 'diversão',
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    description: 'Assinatura mensal'
  },
  {
    id: 7,
    name: 'Farmácia',
    amount: -120.00,
    type: 'outcome',
    category: 'saúde',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    description: 'Medicamentos'
  },
  {
    id: 8,
    name: 'Restaurante',
    amount: -95.50,
    type: 'outcome',
    category: 'alimentação',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    description: 'Jantar com amigos'
  },
  {
    id: 9,
    name: 'Bônus',
    amount: 800.00,
    type: 'income',
    category: 'bônus',
    date: new Date().toISOString(),
    description: 'Bônus de desempenho'
  },
  {
    id: 10,
    name: 'Academia',
    amount: -80.00,
    type: 'outcome',
    category: 'saúde',
    date: new Date().toISOString(),
    description: 'Mensalidade da academia'
  }
];
