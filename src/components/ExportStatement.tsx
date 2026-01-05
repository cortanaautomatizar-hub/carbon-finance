import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Transaction } from "@/components/CreditCard";
import { toast } from "@/components/ui/use-toast";

interface ExportStatementProps {
  transactions: Transaction[];
  cardName: string;
  cardNumber?: string;
}

export const ExportStatement = ({ transactions, cardName, cardNumber }: ExportStatementProps) => {
  
  const generateCSV = (): string => {
    // Cabeçalho
    const headers = ["Data", "Descrição", "Categoria", "Valor (R$)"];
    
    // Linhas de dados
    const rows: (string | number)[][] = transactions.map(t => [
      t.date,
      t.description,
      t.category || "Sem categoria",
      t.amount.toFixed(2),
    ]);
    
    // Totalizadores
    const totalGasto = transactions.reduce((acc, t) => acc + t.amount, 0);
    const totalTransacoes = transactions.length;
    const mediaGasto = totalTransacoes > 0 ? totalGasto / totalTransacoes : 0;
    
    rows.push([]); // Linha em branco
    rows.push(["RESUMO"]); // Seção resumo
    rows.push(["Total de Transações", "", "", totalTransacoes.toString()]);
    rows.push(["Valor Total", "", "", totalGasto.toFixed(2)]);
    rows.push(["Valor Médio", "", "", mediaGasto.toFixed(2)]);
    
    // Agrupar por categoria
    const porCategoria = transactions.reduce((acc, t) => {
      const cat = t.category || "Sem categoria";
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    rows.push([]); // Linha em branco
    rows.push(["POR CATEGORIA"]); // Seção categorias
    Object.entries(porCategoria).forEach(([cat, value]) => {
      rows.push([cat, "", "", value.toFixed(2)]);
    });
    
    // Converter para CSV
    let csv = "Extrato de Transações\n";
    csv += `Cartão: ${cardName}${cardNumber ? ` (${cardNumber})` : ""}\n`;
    csv += `Data de Geração: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    
    // Headers
    csv += headers.join(",") + "\n";
    
    // Dados
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(",") + "\n";
    });
    
    return csv;
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      toast({ 
        title: "Nenhuma transação", 
        description: "Adicione transações antes de exportar" 
      });
      return;
    }

    try {
      const csv = generateCSV();
      const element = document.createElement("a");
      const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
      element.href = URL.createObjectURL(file);
      
      const fileName = `extrato-${cardName}-${new Date().toISOString().split('T')[0]}.csv`;
      element.setAttribute("download", fileName);
      
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({ 
        title: "Extrato exportado!", 
        description: `${fileName} foi baixado com sucesso` 
      });
    } catch (error) {
      toast({ 
        title: "Erro ao exportar", 
        description: "Ocorreu um erro ao gerar o arquivo" 
      });
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      <FileText className="w-4 h-4" />
      Exportar Extrato (CSV)
    </Button>
  );
};
