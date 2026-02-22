import { CreditCardProps } from "@/components/CreditCard";
import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, TrendingUp, Bell } from "lucide-react";

interface Notification {
  id: string;
  type: "warning" | "error" | "info";
  title: string;
  message: string;
  icon: React.ReactNode;
}

interface NotificationPanelProps {
  cards: CreditCardProps[];
}

export const NotificationPanel = ({ cards }: NotificationPanelProps) => {
  const notifications: Notification[] = [];

  cards.forEach((card) => {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    
    const gastosMes = card.transactions
      ?.filter(t => new Date(t.date) >= inicioMes)
      .reduce((acc, t) => acc + t.amount, 0) ?? 0;

    // Fatura vencendo
    if (card.invoice?.total > 0) {
      const rawDue = card.invoice.dueDate || "01/01/1970";
      const dueDateParts = rawDue.split('/');
      const dueDay = parseInt(dueDateParts[0]) || 1;
      const dueMonth = parseInt(dueDateParts[1]) || 1;
      const dueYear = parseInt(dueDateParts[2]) || agora.getFullYear();
      
      const dueDate = new Date(dueYear, dueMonth - 1, dueDay);
      const daysUntilDue = Math.ceil((dueDate.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 7 && daysUntilDue > 0) {
        notifications.push({
          id: `due-${card.id}`,
          type: "warning",
          title: "Fatura vencendo",
          message: `${card.name}: vence em ${daysUntilDue} dia(s) (${card.invoice?.dueDate || '??/??/????'})`,
          icon: <Clock className="w-4 h-4" />,
        });
      } else if (daysUntilDue <= 0) {
        notifications.push({
          id: `overdue-${card.id}`,
          type: "error",
          title: "Fatura vencida",
          message: `${card.name}: pague agora! (R$ ${card.invoice?.total?.toFixed(2) ?? '0.00'})`,
          icon: <AlertCircle className="w-4 h-4" />,
        });
      }
    }

    // Orçamento ultrapassado
    if (card.monthlyBudget && card.monthlyBudget > 0) {
      const percentualUsado = (gastosMes / card.monthlyBudget) * 100;
      
      if (percentualUsado > 100) {
        notifications.push({
          id: `budget-${card.id}`,
          type: "error",
          title: "Orçamento ultrapassado",
          message: `${card.name}: ${percentualUsado.toFixed(0)}% (R$ ${gastosMes.toFixed(2)})`,
          icon: <AlertCircle className="w-4 h-4" />,
        });
      } else if (percentualUsado > 80) {
        notifications.push({
          id: `budget-warning-${card.id}`,
          type: "warning",
          title: "Alerta de orçamento",
          message: `${card.name}: ${percentualUsado.toFixed(0)}% utilizado`,
          icon: <TrendingUp className="w-4 h-4" />,
        });
      }
    }

    // Limite próximo
    if (card.limit > 0) {
      const percentualLimite = (card.used / card.limit) * 100;
      
      if (percentualLimite > 90) {
        notifications.push({
          id: `limit-${card.id}`,
          type: "error",
          title: "Limite alerta",
          message: `${card.name}: ${percentualLimite.toFixed(0)}% utilizado`,
          icon: <AlertCircle className="w-4 h-4" />,
        });
      } else if (percentualLimite > 75) {
        notifications.push({
          id: `limit-warning-${card.id}`,
          type: "warning",
          title: "Limite próximo",
          message: `${card.name}: R$ ${(card.limit - card.used).toFixed(2)} disponível`,
          icon: <TrendingUp className="w-4 h-4" />,
        });
      }
    }
  });

  if (notifications.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        <Bell className="w-5 h-5 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhuma notificação pendente</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notif) => (
        <Card
          key={notif.id}
          className={`p-3 flex items-start gap-3 ${
            notif.type === "error"
              ? "bg-red-50 border-red-200"
              : notif.type === "warning"
              ? "bg-amber-50 border-amber-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div
            className={`flex-shrink-0 mt-0.5 ${
              notif.type === "error"
                ? "text-red-600"
                : notif.type === "warning"
                ? "text-amber-600"
                : "text-blue-600"
            }`}
          >
            {notif.icon}
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-semibold ${
                notif.type === "error"
                  ? "text-red-900"
                  : notif.type === "warning"
                  ? "text-amber-900"
                  : "text-blue-900"
              }`}
            >
              {notif.title}
            </p>
            <p
              className={`text-xs ${
                notif.type === "error"
                  ? "text-red-700"
                  : notif.type === "warning"
                  ? "text-amber-700"
                  : "text-blue-700"
              }`}
            >
              {notif.message}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};
