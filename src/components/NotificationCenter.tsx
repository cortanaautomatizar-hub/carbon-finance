import { useEffect } from "react";
import { CreditCardProps } from "@/components/CreditCard";
import { toast } from "sonner";
import { AlertCircle, Clock, TrendingUp } from "lucide-react";

interface NotificationCenterProps {
  card: CreditCardProps;
  hasShownNotifications?: boolean;
  onNotificationShown?: () => void;
}

export const NotificationCenter = ({ 
  card, 
  hasShownNotifications = false,
  onNotificationShown 
}: NotificationCenterProps) => {
  
  useEffect(() => {
    if (hasShownNotifications) return;

    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    
    // Calcular gastos este mês
    const gastosMes = card.transactions
      ?.filter(t => new Date(t.date) >= inicioMes)
      .reduce((acc, t) => acc + t.amount, 0) ?? 0;

    // Notificação 1: Vencimento de fatura
    if (card.invoice.total > 0) {
      const dueDateParts = card.invoice.dueDate.split('/');
      const dueDay = parseInt(dueDateParts[0]);
      const dueMonth = parseInt(dueDateParts[1]);
      const dueYear = parseInt(dueDateParts[2]) || agora.getFullYear();
      
      const dueDate = new Date(dueYear, dueMonth - 1, dueDay);
      const daysUntilDue = Math.ceil((dueDate.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 7 && daysUntilDue > 0) {
        toast.warning("Fatura vencendo em breve!", {
          description: `Sua fatura de R$ ${card.invoice.total.toFixed(2)} vence em ${daysUntilDue} dia(s). Vença em ${card.invoice.dueDate}`,
          icon: <Clock className="w-4 h-4" />,
          duration: 6000,
        });
      } else if (daysUntilDue <= 0) {
        toast.error("Fatura vencida!", {
          description: `Sua fatura de R$ ${card.invoice.total.toFixed(2)} venceu em ${card.invoice.dueDate}. Pague agora!`,
          icon: <AlertCircle className="w-4 h-4" />,
          duration: 6000,
        });
      }
    }

    // Notificação 2: Limite de gastos ultrapassado
    if (card.monthlyBudget && card.monthlyBudget > 0) {
      const percentualUsado = (gastosMes / card.monthlyBudget) * 100;
      
      if (percentualUsado > 100) {
        toast.error("Orçamento ultrapassado!", {
          description: `Você gastou R$ ${gastosMes.toFixed(2)} de R$ ${card.monthlyBudget.toFixed(2)}. Reduza seus gastos!`,
          icon: <AlertCircle className="w-4 h-4" />,
          duration: 6000,
        });
      } else if (percentualUsado > 80) {
        toast.warning("Alerta de orçamento!", {
          description: `Você atingiu ${percentualUsado.toFixed(0)}% do seu orçamento mensal. Cuidado com os gastos!`,
          icon: <TrendingUp className="w-4 h-4" />,
          duration: 6000,
        });
      }
    }

    // Notificação 3: Cartão próximo do limite
    if (card.limit > 0) {
      const percentualLimite = (card.used / card.limit) * 100;
      
      if (percentualLimite > 90) {
        toast.error("Limite do cartão alerta!", {
          description: `Você utilizou ${percentualLimite.toFixed(0)}% do seu limite de R$ ${card.limit.toFixed(2)}`,
          icon: <AlertCircle className="w-4 h-4" />,
          duration: 6000,
        });
      } else if (percentualLimite > 75) {
        toast.warning("Limite do cartão próximo", {
          description: `Você utilizou ${percentualLimite.toFixed(0)}% do seu limite. Apenas R$ ${(card.limit - card.used).toFixed(2)} disponível`,
          icon: <TrendingUp className="w-4 h-4" />,
          duration: 6000,
        });
      }
    }

    onNotificationShown?.();
  }, [card, hasShownNotifications, onNotificationShown]);

  return null;
};
