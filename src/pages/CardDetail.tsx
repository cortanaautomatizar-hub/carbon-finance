import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import cardsService from "@/services/cards";
import { CreditCardProps, Transaction } from "@/components/CreditCard";
import { CreditCard } from "@/components/CreditCard";
import { TransactionHistory } from "@/components/TransactionHistory";
import { TransactionStats } from "@/components/TransactionStats";
import { ExpenseChart } from "@/components/ExpenseChart";
import { TransactionFilters } from "@/components/TransactionFilters";
import { BudgetGoal } from "@/components/BudgetGoal";
import { VirtualCardGenerator } from "@/components/VirtualCardGenerator";
import { NotificationCenter } from "@/components/NotificationCenter";
import { ExportStatement } from "@/components/ExportStatement";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewTransactionForm } from "@/components/NewTransactionForm";
import { Progress } from "@/components/ui/progress";
import { Calendar, ChevronRight, Clock, Percent, Receipt } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function CardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<CreditCardProps | null>(null);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [notificationsShown, setNotificationsShown] = useState(false);

  const load = () => {
    const found = id ? cardsService.getById(Number(id)) : undefined;
    if (!found) {
      setCard(null);
      return;
    }
    setCard(found);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (card?.transactions) {
      setFilteredTransactions(card.transactions);
    }
  }, [card]);

  if (!card) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-muted-foreground">Cartão não encontrado.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Voltar</Button>
      </div>
    );
  }

  const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
    cardsService.addTransaction(card.id, data);
    load();
  };

  const handleRemoveTransaction = (txId: number) => {
    if (!confirm('Remover esta transação?')) return;
    cardsService.removeTransaction(card.id, txId);
    load();
    toast({ title: 'Transação removida' });
  };

  const handleBudgetUpdate = (budget: number) => {
    const updated: CreditCardProps = {
      ...card,
      monthlyBudget: budget,
    } as CreditCardProps;
    cardsService.update(card.id, updated);
    load();
    toast({ title: `Meta de gastos atualizada para R$ ${budget.toFixed(2)}` });
  };

  const handlePayInvoice = () => {
    if (card.invoice.total === 0) return;
    const newHistoryEntry = {
      month: new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getFullYear(),
      value: card.invoice.total,
      status: 'paga',
    };
    const updated: CreditCardProps = {
      ...card,
      used: 0,
      transactions: [],
      invoice: { ...card.invoice, total: 0, history: [...card.invoice.history, newHistoryEntry] },
    } as CreditCardProps;
    cardsService.update(card.id, updated);
    load();
    toast({ title: 'Fatura paga com sucesso!' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <NotificationCenter 
        card={card} 
        hasShownNotifications={notificationsShown}
        onNotificationShown={() => setNotificationsShown(true)}
      />

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/resumo-cartoes') }>
          <ArrowLeft className="mr-2" /> Voltar ao Resumo
        </Button>
      </div>

      <CreditCard {...card} />

      <div className="flex justify-center">
        <VirtualCardGenerator />
      </div>

      <TransactionStats transactions={card.transactions || []} />

      <BudgetGoal 
        monthlyBudget={card.monthlyBudget} 
        transactions={card.transactions || []}
        onBudgetUpdate={handleBudgetUpdate}
      />

      <ExpenseChart transactions={card.transactions || []} type="pie" />

      <TransactionFilters 
        transactions={card.transactions || []} 
        onFilterChange={setFilteredTransactions}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Transações</h2>
        <ExportStatement 
          transactions={filteredTransactions} 
          cardName={card.name}
          cardNumber={card.number}
        />
      </div>

      <TransactionHistory transactions={filteredTransactions} onRemove={handleRemoveTransaction} />

      <section className="bg-gradient-card rounded-2xl p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-4">Limite do Cartão</h2>
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-sm text-muted-foreground">Limite utilizado</span>
            <p className="text-2xl font-bold">R$ {card.used.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Limite total</span>
            <p className="text-lg font-semibold">R$ {card.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <Progress value={card.limit > 0 ? (card.used / card.limit) * 100 : 0} className="h-3" />
      </section>

      <section className="bg-gradient-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Fatura Atual</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${card.invoice.total > 0 ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success'}`}>
            {card.invoice.total > 0 ? 'Aberta' : 'Paga'}
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm text-muted-foreground">Valor atual</span>
            <p className="text-3xl font-bold">R$ {card.invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
              <Calendar size={14} /> Vencimento
            </span>
            <p className="text-lg font-semibold">{card.invoice.dueDate}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="gold" className="flex-1" onClick={handlePayInvoice} disabled={card.invoice.total === 0}>Pagar Fatura</Button>
          <Dialog open={isTransactionFormOpen} onOpenChange={setIsTransactionFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">Adicionar Transação</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Transação</DialogTitle>
              </DialogHeader>
              <NewTransactionForm onSave={handleAddTransaction} onDone={() => setIsTransactionFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="bg-gradient-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Percent size={20} className="text-primary" />
          <h2 className="text-lg font-semibold">Parcelar Fatura</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Parcele sua fatura atual em até 12x</p>
        <div className="space-y-3">
          {/* simplified: show static options */}
          <button className="w-full p-4 bg-secondary/50 hover:bg-secondary rounded-xl flex items-center justify-between">
            <div>
              <p className="font-semibold">2x sem juros</p>
            </div>
            <ChevronRight />
          </button>
        </div>
      </section>

      <section className="bg-gradient-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-primary" />
          <h2 className="text-lg font-semibold">Histórico de Faturas</h2>
        </div>
        <div className="space-y-3">
          {card.invoice.history.map((invoice, index) => (
            <div key={index} className="w-full p-4 bg-secondary/50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Receipt size={18} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{invoice.month}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">R$ {invoice.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${invoice.status === 'paga' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>{invoice.status === 'paga' ? 'Paga' : 'Aberta'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
