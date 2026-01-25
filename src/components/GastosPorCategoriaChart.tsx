import { useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTransactions } from '@/contexts/TransactionsContext';
import { cards } from "@/data/cards";

// Mapeamento de categorias baseado em palavras-chave na descrição
const getCategoryFromDescription = (description: string): string => {
  const desc = description.toLowerCase();

  if (
    desc.includes("ifood") ||
    desc.includes("restaurante") ||
    desc.includes("mercado") ||
    desc.includes("supermercado") ||
    desc.includes("padaria") ||
    desc.includes("açougue")
  ) {
    return "Alimentação";
  }

  if (
    desc.includes("uber") ||
    desc.includes("táxi") ||
    desc.includes("combustível") ||
    desc.includes("gasolina") ||
    desc.includes("passagem") ||
    desc.includes("transporte") ||
    desc.includes("shell") ||
    desc.includes("metrô")
  ) {
    return "Transporte";
  }

  if (
    desc.includes("cinema") ||
    desc.includes("teatro") ||
    desc.includes("show") ||
    desc.includes("viagem") ||
    desc.includes("hotel") ||
    desc.includes("lazer") ||
    desc.includes("netflix") ||
    desc.includes("spotify") ||
    desc.includes("game")
  ) {
    return "Lazer";
  }

  return "Outros";
};

export const GastosPorCategoriaChart = () => {
  const [periodo, setPeriodo] = useState("Mensal");

  // Use transactions from context (realtime-aware) and fallback to local cards if none exist
  const { transactions } = useTransactions();

  const allTransactions = (transactions ?? []).map((tx) => ({
    ...tx,
    category: tx.category || getCategoryFromDescription(tx.description || ''),
  }));

  // If no transactions from backend, fallback to previous local cards dataset
  const fallbackTransactions = cards.flatMap((card) =>
    (card.transactions || []).map((tx) => ({ ...tx, category: getCategoryFromDescription(tx.description) }))
  );

  const usedTransactions = allTransactions.length > 0 ? allTransactions : fallbackTransactions;

  // Agrupar por categoria
  const categoriaMap = new Map<string, number>();

  usedTransactions.forEach((tx) => {
    const current = categoriaMap.get(tx.category) || 0;
    categoriaMap.set(tx.category, current + (Number(tx.amount) || 0));
  });

  // Se não houver transações, usar dados de exemplo
  if (categoriaMap.size === 0) {
    categoriaMap.set("Alimentação", 1120);
    categoriaMap.set("Transporte", 640);
    categoriaMap.set("Lazer", 800);
    categoriaMap.set("Outros", 640);
  }

  // Converter para array para o gráfico
  const chartData = Array.from(categoriaMap.entries())
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Cores: amarelo e cinzas
  const COLORS = ["#FFCA3A", "#6B7280", "#9CA3AF", "#D1D5DB"];

  return (
    <Card className="p-6 lg:col-span-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gastos por Categoria</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent border-gray-600 hover:bg-gray-900"
            >
              {periodo}
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setPeriodo("Semanal")}>
              Semanal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriodo("Mensal")}>
              Mensal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriodo("Anual")}>
              Anual
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={1}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total faturado</p>
          <p className="text-3xl font-semibold">
            R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Breakdown por categoria */}
        <div className="space-y-2 pt-2 border-t border-gray-700">
          {chartData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(0);
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
