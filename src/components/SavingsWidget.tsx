import { PiggyBank, TrendingUp, ChevronRight } from "lucide-react";

export const SavingsWidget = () => {
  const savings = 8750.00;
  const growth = 2.45;

  return (
    <div className="bg-gradient-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: "0.25s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
            <PiggyBank size={20} className="text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Poupança</h3>
            <div className="flex items-center gap-1 text-success text-sm">
              <TrendingUp size={14} />
              <span>+{growth}% este mês</span>
            </div>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground">
          R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};
