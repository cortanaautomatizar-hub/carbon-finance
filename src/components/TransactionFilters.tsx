import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { Transaction } from "@/components/CreditCard";

interface TransactionFiltersProps {
  transactions: Transaction[];
  onFilterChange: (filtered: Transaction[]) => void;
}

export const TransactionFilters = ({ transactions, onFilterChange }: TransactionFiltersProps) => {
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [category, setCategory] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filtrar por valor
    if (minValue) {
      filtered = filtered.filter(t => t.amount >= parseFloat(minValue));
    }
    if (maxValue) {
      filtered = filtered.filter(t => t.amount <= parseFloat(maxValue));
    }

    // Filtrar por categoria
    if (category && category !== "all") {
      filtered = filtered.filter(t => t.category === category);
    }

    // Filtrar por data
    if (startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate));
    }

    onFilterChange(filtered);
  };

  const clearFilters = () => {
    setMinValue("");
    setMaxValue("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    onFilterChange(transactions);
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        {/* Valor Mínimo */}
        <div>
          <label className="text-sm font-medium mb-1 block">Valor Mín.</label>
          <Input
            type="number"
            placeholder="0"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Valor Máximo */}
        <div>
          <label className="text-sm font-medium mb-1 block">Valor Máx.</label>
          <Input
            type="number"
            placeholder="9999"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="text-sm font-medium mb-1 block">Categoria</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="alimentação">Alimentação</SelectItem>
              <SelectItem value="transporte">Transporte</SelectItem>
              <SelectItem value="saúde">Saúde</SelectItem>
              <SelectItem value="diversão">Diversão</SelectItem>
              <SelectItem value="educação">Educação</SelectItem>
              <SelectItem value="compras">Compras</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Início */}
        <div>
          <label className="text-sm font-medium mb-1 block">De</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Data Fim */}
        <div>
          <label className="text-sm font-medium mb-1 block">Até</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="bg-yellow-400 text-black hover:bg-yellow-500">
          Aplicar Filtros
        </Button>
        <Button onClick={clearFilters} variant="outline">
          <X className="w-4 h-4 mr-2" />
          Limpar
        </Button>
      </div>
    </Card>
  );
};
