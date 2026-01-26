
import { useEffect, useState } from "react";
import cardsService from "@/services/cards";
import { CreditCard, CreditCardProps, Transaction } from "@/components/CreditCard";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Clock, Percent, Receipt, Trash2, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewCreditCardForm } from "@/components/NewCreditCardForm";
import { TransactionHistory } from "@/components/TransactionHistory";
import { NewTransactionForm } from "@/components/NewTransactionForm";
import { toast } from "@/components/ui/use-toast";

export default function CreditCardPage() {
  const [api, setApi] = useState<CarouselApi>();
    const [cards, setCards] = useState<CreditCardProps[]>([]);
    const [selectedCard, setSelectedCard] = useState<CreditCardProps | null>(null);
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  useEffect(() => {
        if (!api) return;

        const handleSlideChange = (carouselApi: CarouselApi) => {
            const newIndex = carouselApi.selectedScrollSnap();
            setSelectedCard(cards[newIndex]);
        };

        api.on("select", handleSlideChange);

        return () => api.off("select", handleSlideChange);
  }, [api, cards]);

    const load = async () => {
        const list = await cardsService.getAll();
        setCards(list);
        setSelectedCard((prev) => {
            if (!prev && list.length > 0) return list[0];
            // keep same selected if exists
            return list.find((c) => c.id === prev?.id) ?? list[0] ?? null;
        });
    };

    useEffect(() => {
        void load();
    }, []);

    const handleSaveCard = async (newCardData: Omit<CreditCardProps, 'id' | 'transactions' | 'invoice'> & { invoice?: CreditCardProps['invoice'] }) => {
        const created = await cardsService.create({
            name: newCardData.name,
            number: newCardData.number,
            expiry: newCardData.expiry,
            cvv: newCardData.cvv,
            brand: newCardData.brand,
            limit: newCardData.limit,
            color: newCardData.color || '#111827',
            textColor: newCardData.textColor || '#ffffff',
            dueDay: newCardData.dueDay,
            closingDay: newCardData.closingDay,
        });

        await load();
        setSelectedCard(created as CreditCardProps);
        setIsCardFormOpen(false);
        setTimeout(async () => {
            const list = await cardsService.getAll();
            api?.scrollTo(list.length - 1);
        }, 100);
    };
  
    const handleRemoveCard = async (id: number) => {
        await cardsService.remove(id);
        await load();
        api?.scrollTo(0);
    };

    const handleSaveTransaction = async (newTransactionData: Omit<Transaction, 'id'>) => {
        if (!selectedCard) return;
        await cardsService.addTransaction(selectedCard.id, newTransactionData);
        await load();
        setIsTransactionFormOpen(false);
    };

    const handlePayInvoice = async () => {
        if (!selectedCard || selectedCard.invoice.total === 0) return;

        // Build updated invoice
        const card = await cardsService.getById(selectedCard.id);
        if (!card) return;
        const newHistoryEntry = {
            month: new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getFullYear(),
            value: card.invoice.total,
            status: 'paga',
        };

        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth());

        const updated = {
            ...card,
            used: 0,
            transactions: [],
            invoice: {
                ...card.invoice,
                total: 0,
                dueDate: `${nextDueDate.getDate()}/${nextDueDate.getMonth() + 1}/${nextDueDate.getFullYear()}`,
                history: [...card.invoice.history, newHistoryEntry],
            },
        } as CreditCardProps;

        cardsService.update(card.id, updated);
        load();
        toast({ title: 'Fatura paga com sucesso!' });
    };

  const installmentOptions = selectedCard ? [
    { parcelas: 2, valor: selectedCard.invoice.total / 2, juros: 0, total: selectedCard.invoice.total },
    { parcelas: 3, valor: (selectedCard.invoice.total * 1.0299) / 3, juros: 2.99, total: selectedCard.invoice.total * 1.0299 },
    { parcelas: 6, valor: (selectedCard.invoice.total * 1.0499) / 6, juros: 4.99, total: selectedCard.invoice.total * 1.0499 },
    { parcelas: 12, valor: (selectedCard.invoice.total * 1.0799) / 12, juros: 7.99, total: selectedCard.invoice.total * 1.0799 },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex justify-end gap-4">
            <Dialog open={isCardFormOpen} onOpenChange={setIsCardFormOpen}>
                <DialogTrigger asChild>
                    <Button>Adicionar Novo Cartão</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Cartão</DialogTitle>
                    </DialogHeader>
                    <NewCreditCardForm onSave={handleSaveCard} />
                </DialogContent>
            </Dialog>
            <Dialog open={isTransactionFormOpen} onOpenChange={setIsTransactionFormOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" disabled={!selectedCard}>Adicionar Transação</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Nova Transação</DialogTitle>
                    </DialogHeader>
                    <NewTransactionForm onSave={handleSaveTransaction} onDone={() => setIsTransactionFormOpen(false)} />
                </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={() => selectedCard && handleRemoveCard(selectedCard.id)} disabled={!selectedCard}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remover Cartão
            </Button>
        </div>

        {cards.length > 0 ? (
          <Carousel
              setApi={setApi}
              opts={{ align: "start", loop: cards.length > 1 }}
              className="w-full"
          >
              <CarouselContent>
                  {cards.map((card) => (
                      <CarouselItem key={card.id}>
                          <CreditCard {...card} />
                      </CarouselItem>
                  ))}
              </CarouselContent>
              {cards.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
          </Carousel>
        ) : (
          <div className="text-center py-10 bg-card rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-semibold">Nenhum cartão cadastrado</h2>
            <p className="text-muted-foreground mt-2">Adicione um novo cartão para começar a usar o aplicativo.</p>
          </div>
        )}

        {selectedCard ? (
          <>
            <TransactionHistory transactions={selectedCard.transactions || []} />
            
            <section className="bg-card rounded-2xl p-6 shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Limite do Cartão</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-sm text-muted-foreground">Limite utilizado</span>
                            <p className="text-2xl font-semibold">
                                R$ {selectedCard.used.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-muted-foreground">Limite total</span>
                            <p className="text-lg font-semibold text-muted-foreground">
                                R$ {selectedCard.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                    <Progress value={selectedCard.limit > 0 ? (selectedCard.used / selectedCard.limit) * 100 : 0} className="h-3" />
                    <div className="flex items-center justify-between p-4 bg-success/10 rounded-xl">
                        <div className="flex items-center gap-3">
                            <TrendingDown size={20} className="text-success" />
                            <span>Limite disponível</span>
                        </div>
                        <span className="text-xl font-semibold text-success">
                            R$ {(selectedCard.limit - selectedCard.used).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </section>

            <section className="bg-card rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Fatura Atual</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCard.invoice.total > 0 ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success'}`}>
                        {selectedCard.invoice.total > 0 ? 'Aberta' : 'Paga'}
                    </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-sm text-muted-foreground">Valor atual</span>
                        <p className="text-3xl font-semibold">
                            R$ {selectedCard.invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                            <Calendar size={14} />
                            Vencimento
                        </span>
                        <p className="text-lg font-semibold text-foreground">{selectedCard.invoice.dueDate}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="gold" 
                        className="flex-1" 
                        onClick={handlePayInvoice}
                        disabled={selectedCard.invoice.total === 0}
                    >
                        Pagar Fatura
                    </Button>
                    <Button variant="outline" className="flex-1">Ver Detalhes</Button>
                </div>
            </section>

            <section className="bg-card rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center gap-2 mb-4">
                    <Percent size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold">Parcelar Fatura</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Parcele sua fatura atual em até 12x</p>
                <div className="space-y-3">
                    {selectedCard.invoice.total > 0 && installmentOptions.map((option) => (
                        <button key={option.parcelas} className="w-full p-4 bg-secondary/50 hover:bg-secondary rounded-xl flex items-center justify-between transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                    <span className="text-sm font-bold text-foreground">{option.parcelas}x</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-foreground">
                                        {option.parcelas}x de R$ {option.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {option.juros === 0 ? (
                                            <span className="text-success">Sem juros</span>
                                        ) : (
                                            <span>Juros de {option.juros}% a.m.</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Total: R$ {option.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                <ChevronRight size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="bg-card rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center gap-2 mb-4">
                    <Clock size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold">Histórico de Faturas</h2>
                </div>
                <div className="space-y-3">
                    {selectedCard.invoice.history.map((invoice, index) => (
                        <button key={index} className="w-full p-4 bg-secondary/50 hover:bg-secondary rounded-xl flex items-center justify-between transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                    <Receipt size={18} className="text-muted-foreground" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-foreground">{invoice.month}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="font-semibold text-foreground">
                                        R$ {invoice.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${invoice.status === 'paga' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                                        {invoice.status === 'paga' ? 'Paga' : 'Aberta'}
                                    </span>
                                </div>
                                <ChevronRight size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>
            </section>
          </>
        ) : null}
    </div>
  );
}
