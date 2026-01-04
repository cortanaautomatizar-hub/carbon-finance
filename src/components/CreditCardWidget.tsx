import { CreditCard, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CreditCardWidget = () => {
  const usedLimit = 3250.00;
  const totalLimit = 15000.00;
  const availableLimit = totalLimit - usedLimit;
  const percentage = (usedLimit / totalLimit) * 100;

  return (
    <Link to="/cartao" className="block">
      <div className="bg-gradient-card rounded-2xl p-6 shadow-card animate-slide-up hover:bg-secondary/50 transition-colors" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <CreditCard size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Cartão de Crédito</h3>
              <span className="text-sm text-muted-foreground">•••• 4521</span>
            </div>
          </div>
          <span className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight size={20} />
          </span>
        </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Fatura atual</span>
          <span className="text-foreground font-semibold">
            R$ {usedLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-gold rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Limite disponível</span>
          <span className="text-success font-medium">
            R$ {availableLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        </div>
      </div>
    </Link>
  );
};
