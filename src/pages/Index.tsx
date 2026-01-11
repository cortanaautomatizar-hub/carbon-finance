
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
import { GastosPorCategoriaChart } from "@/components/GastosPorCategoriaChart";

// Dados estáticos para as transações
const transactions = [
  {
    icon: <ShoppingCart size={20} className="text-gray-400" />,
    name: "Supermercado Silva",
    description: "Compra no débito • Hoje, 14:30",
    amount: -342.50,
  },
  {
    icon: <DollarSign size={20} className="text-gray-400" />,
    name: "Salário Mensal",
    description: "Pix Recebido • Ontem",
    amount: 4500.00,
  },
  {
    icon: <Receipt size={20} className="text-gray-400" />,
    name: "Netflix",
    description: "Assinatura • 02 Out",
    amount: -55.90,
  },
  {
    icon: <Fuel size={20} className="text-gray-400" />,
    name: "Posto Shell",
    description: "Crédito • 01 Out",
    amount: -120.00,
  },
];

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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das suas finanças</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card: Saldo em Conta */}
        <Card className="p-6 flex flex-col justify-between lg:col-span-1">
          <div>
            <div className="flex justify-between items-center text-muted-foreground mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/15 p-2 rounded-lg">
                  <Landmark size={16} className="text-primary" />
                </div>
                <span className="font-medium text-sm uppercase tracking-wider">SALDO EM CONTA</span>
              </div>
              <ArrowRight size={16} />
            </div>
            <h2 className="text-3xl font-semibold">R$ 12.450,00</h2>
            <p className="text-sm text-green-500 mt-1">+ R$ 1.200,00 últimos 7 dias</p>
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
          <h2 className="text-3xl font-semibold">R$ 3.200,00</h2>
          <p className="text-sm text-muted-foreground mt-1">Fechamento em 10 OUT</p>
          <div className="mt-4">
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                  <span>Limite utilizado</span>
                  <span>65%</span>
              </div>
            <Progress value={65} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Disponível: R$ 1.800,00</p>
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
          <h2 className="text-3xl font-semibold">R$ 45.000,00</h2>
          <p className="text-sm text-green-500 mt-1">↑12% no ano</p>
          <InvestmentChart />
        </Card>

        {/* Card: Gastos por Categoria (Gráfico de Pizza) */}
        <GastosPorCategoriaChart />

        {/* Card: Últimas Transações */}
        <Card className="p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Últimas transações</h3>
                <Button variant="link" className="text-primary">Ver tudo</Button>
            </div>
            <div className="flex flex-col gap-4">
                {transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent p-2 rounded-full">
                                {transaction.icon}
                            </div>
                            <div>
                                <p className="font-semibold">{transaction.name}</p>
                                <p className="text-sm text-muted-foreground">{transaction.description}</p>
                            </div>
                        </div>
                        <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : ''}`}>
                            {transaction.amount > 0 ? `+ R$ ${transaction.amount.toFixed(2)}` : `- R$ ${Math.abs(transaction.amount).toFixed(2)}`}
                        </p>
                    </div>
                ))}
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
