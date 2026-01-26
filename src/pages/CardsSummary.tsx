
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Wallet, Trash2, Plus, ChevronDown, CreditCard as CreditCardIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cardsService from "@/services/cards";
import { CreditCardProps } from "@/components/CreditCard";
import { NotificationPanel } from "@/components/NotificationPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewCreditCardForm } from "@/components/NewCreditCardForm";

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const CardsSummary = () => {
  const [cards, setCards] = useState<CreditCardProps[]>([]);
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);

  const load = async () => setCards(await cardsService.getAll());

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Remover este cartão?')) return;
    await cardsService.remove(id);
    await load();
  };

type NewCardInput = Omit<CreditCardProps, 'id' | 'transactions' | 'invoice'> & { invoice?: CreditCardProps['invoice'] };

  const handleSaveCard = async (newCardData: NewCardInput) => {
    await cardsService.create({
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
    setIsCardFormOpen(false);
  };

  const totalGasto = cards.reduce((acc, card) => acc + (card.used ?? 0), 0);
  const totalLimite = cards.reduce((acc, card) => acc + (card.limit ?? 0), 0);
  const totalDisponivel = totalLimite - totalGasto;
  const consumoPercentual = totalLimite > 0 ? (totalGasto / totalLimite) * 100 : 0;

  return (
    <div className="bg-background text-foreground min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Resumo Geral</h1>
            <p className="text-muted-foreground">Visão consolidada dos seus limites e faturas.</p>
          </div>
          <Button variant="ghost" className="bg-card p-2 h-auto rounded-md">
            <CreditCardIcon className="text-primary"/>
          </Button>
        </header>

        {/* Painel de Notificações */}
        <Card className="bg-card border-border p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold">Notificações</h2>
          </div>
          <NotificationPanel cards={cards} />
        </Card>

        <Card className="bg-card border-border p-6 mb-10">
          <div className="flex items-center mb-6">
            <Wallet size={20} className="text-primary mr-3"/>
            <h2 className="text-lg font-semibold">Balanço Total</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground mb-1">TOTAL GASTO</p>
              <p className="text-2xl font-bold">{formatCurrency(totalGasto)}</p>
            </div>
            <div className="text-center md:text-left md:pl-6 md:border-l md:border-r md:border-border h-full flex flex-col justify-center">
              <p className="text-sm text-muted-foreground mb-1">DISPONÍVEL TOTAL</p>
              <p className="text-2xl font-bold">{formatCurrency(totalDisponivel)}</p>
            </div>
            <div className="text-center md:text-left md:pl-6">
              <p className="text-sm text-muted-foreground mb-1">LIMITE TOTAL</p>
              <p className="text-2xl font-bold">{formatCurrency(totalLimite)}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span className="text-sm text-muted-foreground">Consumo do Limite</span>
              </div>
              <span className="text-sm font-semibold">{consumoPercentual.toFixed(0)}% utilizado</span>
            </div>
            <Progress value={consumoPercentual} className="h-2" />
          </div>
        </Card>

        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
                <span className="w-1 h-6 bg-primary mr-3"></span>
                Detalhes por Cartão
            </h2>
            <Button onClick={load} variant="secondary" className="bg-card border-border">
                Atualizar
                <ChevronDown size={16} className="ml-2"/>
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card.id} className={`bg-card p-5 flex flex-col justify-between border-border`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <Link to={`/cartao/${card.id}`} className="flex items-center">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3`} style={{ backgroundColor: card.color }}>
                        <span className="font-bold text-white">{card.name?.slice(0,2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{card.name}</p>
                        <p className="text-xs text-muted-foreground">FINAL {card.number.slice(-4)}</p>
                      </div>
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => {
                      const newName = prompt('Nome do cartão', card.name || '');
                      if (!newName) return;
                      const limitStr = prompt('Limite (ex: 15000)', String(card.limit ?? 0));
                      const limit = limitStr ? Number(limitStr) : card.limit;
                      cardsService.update(card.id, { name: newName, limit });
                      load();
                    }} variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronDown size={16} className="text-muted-foreground" />
                    </Button>
                    <Button onClick={() => handleDelete(card.id)} variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 size={16} className="text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">GASTO ATUAL</p>
                  <p className="text-xl font-bold">{formatCurrency(card.used ?? 0)}</p>
                </div>
                <Progress value={((card.used ?? 0) / (card.limit ?? 1)) * 100} className="h-1.5" />
              </div>
              <div className="mt-4 flex justify-between items-center text-sm">
                <p className="text-muted-foreground">Limite Total</p>
                <p className="font-semibold">{formatCurrency(card.limit ?? 0)}</p>
              </div>
            </Card>
          ))}
          <Card className="bg-card border-dashed border-border flex flex-col items-center justify-center p-5 min-h-[220px]">
            <Dialog open={isCardFormOpen} onOpenChange={setIsCardFormOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-16 h-16 rounded-full bg-secondary mb-3">
                  <Plus size={32} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cartão</DialogTitle>
                </DialogHeader>
                <NewCreditCardForm onSave={handleSaveCard} />
              </DialogContent>
            </Dialog>
            <p className="font-semibold mb-1">Adicionar Cartão</p>
            <p className="text-xs text-muted-foreground">Conecte uma nova conta</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CardsSummary;
