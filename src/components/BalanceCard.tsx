import { Eye, EyeOff, PlusCircle, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatarMoedaBRL } from "@/lib/saldoConsolidado";

interface BalanceCardProps {
  /** Saldo líquido disponível (valor em reais) */
  saldoLiquido?: number;
  /** Variação percentual no período (ex: 2.5 = +2.5%) */
  variacaoPercentual?: number;
  /** Callback para ação de nova transação */
  onNovaTransacao?: () => void;
}

export const BalanceCard = ({
  saldoLiquido = 24850.75,
  variacaoPercentual,
  onNovaTransacao,
}: BalanceCardProps) => {
  const [showBalance, setShowBalance] = useState(true);

  const variacaoPositiva = (variacaoPercentual ?? 0) >= 0;

  return (
    <div className="bg-gradient-card rounded-2xl p-6 shadow-card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-muted-foreground text-sm font-medium">Saldo disponível</span>
          {typeof variacaoPercentual === 'number' && (
            <div className="text-xs mt-1 flex items-center gap-1">
              {variacaoPositiva ? (
                <ArrowUp className="text-success" size={14} />
              ) : (
                <ArrowDown className="text-destructive" size={14} />
              )}
              <span className={cn(variacaoPositiva ? 'text-success' : 'text-destructive')}>
                {variacaoPositiva ? '+' : '-'}{Math.abs(variacaoPercentual).toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label={showBalance ? 'Ocultar saldo' : 'Mostrar saldo'}
            onClick={() => setShowBalance(!showBalance)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>

          <button
            aria-label="Nova transação"
            onClick={() => onNovaTransacao?.()}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-md hover:opacity-95"
          >
            <PlusCircle size={16} />
            <span className="text-sm font-medium">Nova transação</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <span
          data-testid="balance-value"
          className={cn(
            "text-4xl font-semibold text-foreground transition-all duration-300",
            !showBalance && "blur-lg select-none"
          )}
        >
          {showBalance ? formatarMoedaBRL(saldoLiquido) : '••••••'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-success text-sm">Conta ativa</span>
      </div>
    </div>
  );
};
