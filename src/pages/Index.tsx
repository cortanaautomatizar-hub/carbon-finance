
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Landmark,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Star,
  ShoppingCart,
  DollarSign,
  Receipt,
  Fuel,
} from "lucide-react";
import NovaTransacao from '@/components/NovaTransacao';
import { GastosPorCategoriaChart } from "@/components/GastosPorCategoriaChart";
import { formatarMoedaBRL } from "@/lib/saldoConsolidado";
import { useSaldoConsolidado } from "@/hooks/useSaldoConsolidado";
import { cards } from "@/data/cards";
import { investments } from "@/data/investments";

import { useTransactions } from '@/contexts/TransactionsContext';

// NOTE: Transactions are now provided by TransactionsContext


const InvestmentChart = () => (
    <svg viewBox="0 0 100 30" className="w-full h-auto mt-2">
      <path
        d="M 0,25 C 10,20 20,10 30,15 S 50,25 60,20 S 80,5 90,10 L 100,8"
        fill="none"
        stroke="#22C55E"
        strokeWidth="2"
      />
    </svg>
  );

export default function DashboardPage() {
  const { transactions } = useTransactions();
  const saldo = useSaldoConsolidado(transactions);

  const faturaTotal = cards.reduce((s, c) => s + ((c.invoice && c.invoice.total) ? c.invoice.total : 0), 0);
  const investmentsTotal = investments.reduce((s, i) => s + (i.balance || 0), 0);
  const avgInvestChange = investments.length ? (investments.reduce((s, i) => s + i.rentability, 0) / investments.length) : 0;

  // Limites de cartão (soma de todos os cartões)
  const totalLimit = cards.reduce((s, c) => s + (c.limit || 0), 0);
  const totalUsed = cards.reduce((s, c) => s + (c.used || 0), 0);
  const usedPercent = totalLimit ? Math.round((totalUsed / totalLimit) * 100) : 0;
  const totalAvailable = totalLimit - totalUsed;

  // upcoming invoices sorted by due date
  const upcomingInvoices = [...cards]
    .filter(c => c.invoice && c.invoice.total > 0 && c.invoice.dueDate)
    .map(c => ({
      ...c,
      due: (() => {
        const [d, m, y] = c.invoice.dueDate.split('/').map(s=>parseInt(s,10));
        return new Date(y||new Date().getFullYear(), (m||1)-1, d||1);
      })()
    }))
    .sort((a,b)=>a.due.getTime()-b.due.getTime())
    .slice(0,3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Carbon Finance 2.0 🚀</h1>
        <p className="text-muted-foreground">Visão geral das suas finanças</p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* upcoming invoices */}
        {upcomingInvoices.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Próximas Faturas</h2>
            <div className="space-y-3">
              {upcomingInvoices.map(c => (
                <div key={c.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">Vence em {c.due.toLocaleDateString('pt-BR')}</p>
                  </div>
                  <p className="font-semibold">{formatarMoedaBRL(c.invoice.total)}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card: Saldo Consolidado (calculado) */}
        <Card className="p-6 flex flex-col justify-between lg:col-span-1">
          <div>
            <div className="flex justify-between items-center text-muted-foreground mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/15 p-2 rounded-lg">
                  <DollarSign size={16} className="text-primary" />
                </div>
                <span className="font-medium text-sm uppercase tracking-wider">SALDO CONSOLIDADO</span>
              </div>
              <ArrowRight size={16} />
            </div>
            {/* Saldo calculado via hook */}
            <h2 className="text-3xl font-semibold">{saldo.saldoFormatado}</h2>
            <p className="text-sm text-muted-foreground mt-1">Entradas: {formatarMoedaBRL(saldo.totalEntradas)} • Saídas: {formatarMoedaBRL(saldo.totalSaidas)}</p>
          </div>
          <Button className="w-full mt-6">
            Ver Extrato
          </Button>
        </Card>

        {/* Card: Fatura Atual */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex justify-between items-center text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary/15 p-2 rounded-lg">
                <CreditCard size={16} className="text-primary" />
              </div>
              <span className="font-medium text-sm uppercase tracking-wider">FATURA ATUAL</span>
            </div>
            <ArrowRight size={16} />
          </div>
          <h2 className="text-3xl font-semibold">{formatarMoedaBRL(faturaTotal)}</h2>
          <p className="text-sm text-muted-foreground mt-1">Fechamento em 10 OUT</p>
          <div className="mt-4">
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                  <span>Limite utilizado</span>
                  <span>{usedPercent}%</span>
              </div>
            <Progress value={usedPercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Disponível: {formatarMoedaBRL(totalAvailable)}</p>
          </div>
        </Card>

        {/* Card: Investimentos */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex justify-between items-center text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary/15 p-2 rounded-lg">
                <TrendingUp size={16} className="text-primary" />
              </div>
              <span className="font-medium text-sm uppercase tracking-wider">INVESTIMENTOS</span>
            </div>
            <ArrowRight size={16} />
          </div>
          <h2 className="text-3xl font-semibold">{formatarMoedaBRL(investmentsTotal)}</h2>
          <p className="text-sm text-green-500 mt-1">{avgInvestChange >= 0 ? '↑' : '↓'}{avgInvestChange.toFixed(2)}% no ano</p>
          <InvestmentChart />
        </Card>

        {/* Card: Gastos por Categoria (Gráfico de Pizza) */}
        <GastosPorCategoriaChart />

        {/* Card: Últimas Transações */}
        <Card className="p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Últimas transações</h3>
                <div className="flex items-center gap-2">
                  <NovaTransacao />
                  <Button variant="link" className="text-primary">Ver tudo</Button>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {transactions.map((transaction) => {
                    const getIcon = () => {
                      switch (transaction.category) {
                        case 'Salário': return <DollarSign size={20} className="text-gray-400" />;
                        case 'Alimentação': return <ShoppingCart size={20} className="text-gray-400" />;
                        case 'Assinatura': return <Receipt size={20} className="text-gray-400" />;
                        case 'Transporte': return <Fuel size={20} className="text-gray-400" />;
                        default: return <ShoppingCart size={20} className="text-gray-400" />;
                      }
                    };

                    return (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent p-2 rounded-full">
                                {getIcon()}
                            </div>
                            <div>
                                <p className="font-semibold">{transaction.name}</p>
                                <p className="text-sm text-muted-foreground">{transaction.description}</p>
                            </div>
                        </div>
                        <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-destructive'}`}>
                            {transaction.amount > 0 ? `+ ${formatarMoedaBRL(transaction.amount)}` : `- ${formatarMoedaBRL(Math.abs(transaction.amount))}`}
                        </p>
                      </div>
                    );
                })}
            </div>
        </Card>

        {/* Cards da Coluna Direita */}
        <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Card: Átomos */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-primary/15 p-2 rounded-lg">
                        <Star size={16} className="text-primary" />
                    </div>
                    <span className="font-medium text-sm text-muted-foreground uppercase tracking-wider">ÁTOMOS</span>
                </div>
                <p className="text-2xl font-semibold">25.400 pts</p>
                <p className="text-sm text-muted-foreground">Equivale a aprox. R$ 750,00</p>
            </Card>

            {/* Card: Conta Global */}
            <Card className="p-6">
                <Badge className="mb-3">NOVIDADE</Badge>
                <h3 className="font-semibold mb-1">Conta Global em Dólar e Euro</h3>
                <p className="text-sm text-muted-foreground mb-4">Economize no IOF e viaje tranquilo com o cartão de débito internacional.</p>
                <Button variant="secondary" className="bg-gray-600/50 text-white hover:bg-gray-500/50">Saiba mais</Button>
            </Card>
        </div>

      </div>
    </div>
  );
}
