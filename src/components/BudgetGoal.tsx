import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Target, TrendingUp } from "lucide-react";
import { Transaction } from "@/components/CreditCard";

interface BudgetGoalProps {
  monthlyBudget?: number;
  transactions: Transaction[];
  onBudgetUpdate: (budget: number) => void;
}

export const BudgetGoal = ({ monthlyBudget = 0, transactions, onBudgetUpdate }: BudgetGoalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(monthlyBudget.toString());

  // Calcular gastos este mês
  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const gastosMes = transactions
    .filter(t => new Date(t.date) >= inicioMes)
    .reduce((acc, t) => acc + t.amount, 0);

  const percentualUsado = monthlyBudget > 0 ? (gastosMes / monthlyBudget) * 100 : 0;
  
  // Cores baseadas no percentual
  let statusColor = "bg-emerald-500"; // Verde
  let statusText = "Dentro do orçamento";
  let statusBg = "bg-emerald-100 text-emerald-800";

  if (percentualUsado > 100) {
    statusColor = "bg-red-500"; // Vermelho
    statusText = "Orçamento ultrapassado!";
    statusBg = "bg-red-100 text-red-800";
  } else if (percentualUsado > 80) {
    statusColor = "bg-amber-500"; // Amarelo
    statusText = "Atenção: 80% do orçamento";
    statusBg = "bg-amber-100 text-amber-800";
  }

  const handleSave = () => {
    const newBudget = parseFloat(inputValue) || 0;
    onBudgetUpdate(newBudget);
    setIsEditing(false);
  };

  if (monthlyBudget === 0) {
    return (
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Meta de Gastos</h3>
        </div>
        <p className="text-sm text-blue-700 mb-4">
          Defina um limite mensal para acompanhar seus gastos
        </p>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Ex: 1500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-9"
          />
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Definir
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Meta de Gastos</h3>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-2 mb-4">
          <Input
            type="number"
            placeholder="Ex: 1500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-9"
          />
          <Button onClick={handleSave} size="sm" className="bg-primary hover:bg-primary/90">
            Salvar
          </Button>
          <Button
            onClick={() => {
              setInputValue(monthlyBudget.toString());
              setIsEditing(false);
            }}
            variant="outline"
            size="sm"
          >
            Cancelar
          </Button>
        </div>
      ) : null}

      <div className="space-y-4">
        {/* Informações */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Orçamento</p>
            <p className="text-lg font-bold">R$ {monthlyBudget.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gasto</p>
            <p className="text-lg font-bold">R$ {gastosMes.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Disponível</p>
            <p className={`text-lg font-bold ${monthlyBudget - gastosMes >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              R$ {Math.max(monthlyBudget - gastosMes, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${statusBg}`}>
              {percentualUsado.toFixed(0)}%
            </span>
          </div>
          <Progress value={Math.min(percentualUsado, 100)} className="h-3" />
        </div>

        {/* Alerta */}
        {percentualUsado > 80 && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${statusBg}`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{statusText}</p>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">{statusText}</span>
        </div>
      </div>
    </Card>
  );
};
