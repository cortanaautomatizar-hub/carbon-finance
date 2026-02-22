import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/contexts/TransactionsContext";
import { useState, useMemo } from "react";

const formatarData = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("pt-BR");
  } catch {
    return "-";
  }
};

const formatarMoeda = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function ExtratoPage() {
  const navigate = useNavigate();
  const { transactions, stats } = useTransactions();
  // filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchText, setSearchText] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      let ok = true;
      if (startDate && tx.date) ok = ok && new Date(tx.date) >= new Date(startDate);
      if (endDate && tx.date) ok = ok && new Date(tx.date) <= new Date(endDate + 'T23:59:59');
      if (searchText) {
        const txt = searchText.toLowerCase();
        ok = ok && ((tx.name?.toLowerCase().includes(txt)) || (tx.description?.toLowerCase().includes(txt)) || (tx.category?.toLowerCase().includes(txt)));
      }
      return ok;
    });
  }, [transactions, startDate, endDate, searchText]);

  const exportCsv = () => {
    const rows = [
      ['Data','Descrição','Categoria','Valor']
    ];
    filtered.forEach(tx => {
      rows.push([
        formatarData(tx.date),
        tx.name || tx.description || '',
        tx.category || '',
        tx.amount.toString(),
      ]);
    });

    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'extrato.csv');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">Extrato Completo</h1>
          <p className="text-muted-foreground">Histórico de todas as suas transações</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">TOTAL ENTRADAS</p>
          <p className="text-2xl font-bold text-green-500">{formatarMoeda(stats.income)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">TOTAL SAÍDAS</p>
          <p className="text-2xl font-bold text-red-500">{formatarMoeda(stats.outcome)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">SALDO LÍQUIDO</p>
          <p className={`text-2xl font-bold ${stats.total >= 0 ? "text-green-500" : "text-red-500"}`}>
            {formatarMoeda(stats.total)}
          </p>
        </Card>
      </div>

      {/* Filtros e Exportar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1">
          <label className="text-sm">De:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-sm">Até:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-border rounded px-2 py-1 text-sm"
          />
        </div>
        <input
          type="text"
          placeholder="Pesquisar..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-border rounded px-2 py-1 text-sm flex-1 max-w-xs"
        />
        <Button variant="outline" className="flex items-center gap-2" onClick={exportCsv}>
          <Download size={16} />
          Exportar
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/cartao') }>
          <Plus size={16} />
          Nova transação
        </Button>
      </div>

      {/* Tabela de Transações */}
      <Card className="p-0 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>Nenhuma transação registrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold text-sm">Data</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Descrição</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Categoria</th>
                  <th className="px-6 py-4 text-right font-semibold text-sm">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-sm">{formatarData(tx.date)}</td>
                    <td className="px-6 py-4 text-sm font-medium">{tx.name || tx.description || "-"}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <span className="inline-block bg-muted px-2 py-1 rounded text-xs">
                        {tx.category || "-"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold text-right ${
                        tx.amount >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatarMoeda(Math.abs(tx.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Rodapé com resumo */}
      {transactions.length > 0 && (
        <Card className="p-4 bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Total de {transactions.length} transação{transactions.length !== 1 ? "s" : ""} registrada
            {transactions.length !== 1 ? "s" : ""}
          </p>
        </Card>
      )}
    </div>
  );
}
