import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const balance = 24850.75;

  return (
    <div className="bg-gradient-card rounded-2xl p-6 shadow-card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground text-sm font-medium">Saldo disponível</span>
        <button 
          onClick={() => setShowBalance(!showBalance)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      
      <div className="mb-6">
        <span className={cn(
          "text-4xl font-semibold text-foreground transition-all duration-300",
          !showBalance && "blur-lg select-none"
        )}>
          R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-success text-sm">Conta ativa</span>
      </div>
    </div>
  );
};
