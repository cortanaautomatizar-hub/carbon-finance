import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Transaction } from "@/components/CreditCard";

interface ExpenseChartProps {
  transactions: Transaction[];
  type?: "pie" | "bar";
}

const CATEGORIES = {
  "alimentação": "#FF6B6B",
  "transporte": "#4ECDC4",
  "saúde": "#45B7D1",
  "diversão": "#FFA07A",
  "educação": "#98D8C8",
  "compras": "#F7DC6F",
  "outros": "#BDC3C7",
};

export const ExpenseChart = ({ transactions, type = "pie" }: ExpenseChartProps) => {
  // Agrupar por categoria
  const categoryData = Object.keys(CATEGORIES).map(category => {
    const total = transactions
      .filter(t => t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: category, value: total };
  }).filter(d => d.value > 0);

  if (categoryData.length === 0) {
    return (
      <Card className="p-4 text-center text-gray-500">
        <p>Nenhuma transação registrada</p>
      </Card>
    );
  }

  const colors = categoryData.map(d => CATEGORIES[d.name as keyof typeof CATEGORIES]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Gastos por Categoria</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === "pie" ? (
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {colors.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        ) : (
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
              {colors.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
};
