import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Coffee, Car, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  icon: React.ReactNode;
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "Pix",
    description: "João Silva",
    amount: 1500.00,
    date: "Hoje, 14:32",
    icon: <ArrowDownLeft size={18} />,
  },
  {
    id: "2",
    type: "expense",
    category: "Compras",
    description: "Magazine Luiza",
    amount: 459.90,
    date: "Hoje, 11:45",
    icon: <ShoppingBag size={18} />,
  },
  {
    id: "3",
    type: "expense",
    category: "Alimentação",
    description: "Starbucks",
    amount: 32.50,
    date: "Ontem, 18:20",
    icon: <Coffee size={18} />,
  },
  {
    id: "4",
    type: "expense",
    category: "Transporte",
    description: "Uber",
    amount: 28.75,
    date: "Ontem, 09:15",
    icon: <Car size={18} />,
  },
  {
    id: "5",
    type: "expense",
    category: "Serviços",
    description: "Netflix",
    amount: 55.90,
    date: "27 dez",
    icon: <Smartphone size={18} />,
  },
];

const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
  <div className="flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-secondary/30 px-2 -mx-2 rounded-lg transition-colors cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        transaction.type === "income" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
      )}>
        {transaction.icon}
      </div>
      <div>
        <p className="font-medium text-foreground">{transaction.description}</p>
        <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
      </div>
    </div>
    <span className={cn(
      "font-semibold",
      transaction.type === "income" ? "text-success" : "text-foreground"
    )}>
      {transaction.type === "income" ? "+" : "-"} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    </span>
  </div>
);

export const TransactionList = () => {
  return (
    <div className="bg-gradient-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Últimas transações</h2>
        <button className="text-primary text-sm font-medium hover:underline">
          Ver todas
        </button>
      </div>
      
      <div>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};
