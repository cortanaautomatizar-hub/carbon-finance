import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target, AlertCircle } from "lucide-react";
import { Transaction } from "@/services/cards";

interface TransactionStatsProps {
  transactions: Transaction[];
}

import Decimal from 'decimal.js';

export const TransactionStats = ({ transactions }: TransactionStatsProps) => {
  // Calcular estatísticas com Decimal para precisão
  const totalGasto = transactions.reduce((acc, t) => new Decimal(acc).plus(new Decimal(t.amount ?? 0)).toNumber(), 0);
  const transactionCount = transactions.length;
  const mediaGasto = transactionCount > 0 ? new Decimal(totalGasto).dividedBy(transactionCount).toNumber() : 0;
  const maiorCompra = transactions.length > 0 ? Math.max(...transactions.map(t => t.amount ?? 0)) : 0;
  
  // Gastos este mês
  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const gastosMes = transactions
    .filter(t => new Date(t.date) >= inicioMes)
    .reduce((acc, t) => new Decimal(acc).plus(new Decimal(t.amount ?? 0)).toNumber(), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Gasto */}
      <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Total Gasto</p>
            <h3 className="text-2xl font-bold mt-1">
              R$ {totalGasto.toFixed(2)}
            </h3>
          </div>
          <DollarSign className="w-8 h-8 opacity-80" />
        </div>
      </Card>

      {/* Média por Transação */}
      <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Média/Transação</p>
            <h3 className="text-2xl font-bold mt-1">
              R$ {mediaGasto.toFixed(2)}
            </h3>
          </div>
          <TrendingUp className="w-8 h-8 opacity-80" />
        </div>
      </Card>

      {/* Maior Compra */}
      <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Maior Compra</p>
            <h3 className="text-2xl font-bold mt-1">
              R$ {maiorCompra.toFixed(2)}
            </h3>
          </div>
          <Target className="w-8 h-8 opacity-80" />
        </div>
      </Card>

      {/* Gastos Este Mês */}
      <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Este Mês</p>
            <h3 className="text-2xl font-bold mt-1">
              R$ {gastosMes.toFixed(2)}
            </h3>
          </div>
          <AlertCircle className="w-8 h-8 opacity-80" />
        </div>
      </Card>
    </div>
  );
};
