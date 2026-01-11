import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { cards } from "@/data/cards";

export const SpendingByCardChart = () => {
  // Preparar dados do gráfico
  const chartData = cards.map((card) => ({
    name: card.name,
    value: card.used,
    color: card.color,
  }));

  const totalSpending = chartData.reduce((sum, item) => sum + item.value, 0);

  const COLORS = chartData.map((item) => item.color);

  return (
    <Card className="p-6 lg:col-span-1">
      <h3 className="text-lg font-semibold mb-4">Gastos por Cartão</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
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
              <span className="text-sm text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-2">
        <p className="text-sm text-muted-foreground">
          <strong>Total de Gastos:</strong>
        </p>
        <p className="text-2xl font-semibold text-primary">
          R$ {totalSpending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>

        {/* Breakdown por cartão */}
        <div className="mt-4 space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.name}</span>
              </div>
              <span className="font-medium">
                R$ {Number(item.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
