import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText } from "lucide-react";
import { useState } from "react";

interface ReportOptions {
  type: "general" | "by-category" | "summary";
  period: "month" | "quarter" | "year" | "all";
  format: "pdf" | "excel";
}

export const LoanReportDialog = () => {
  const [options, setOptions] = useState<ReportOptions>({
    type: "general",
    period: "month",
    format: "pdf",
  });

  const reportTypes = [
    { value: "general", label: "Relatório Geral" },
    { value: "by-category", label: "Por Tipo de Empréstimo" },
    { value: "summary", label: "Resumo Executivo" },
  ];

  const periods = [
    { value: "month", label: "Último Mês" },
    { value: "quarter", label: "Último Trimestre" },
    { value: "year", label: "Último Ano" },
    { value: "all", label: "Todo o Período" },
  ];

  const formats = [
    { value: "pdf", label: "PDF" },
    { value: "excel", label: "Excel (XLSX)" },
  ];

  const handleDownload = () => {
    // Aqui entra a lógica de gerar o relatório
    console.log("Gerando relatório com opções:", options);
    // Por enquanto, simular download
    alert(`Relatório ${options.type} em ${options.format} será gerado para o período: ${options.period}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="gold" size="sm">
          <FileText size={16} />
          Relatório
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Gerar Relatório de Empréstimos</DialogTitle>
          <DialogDescription>
            Selecione o tipo de relatório, período e formato desejados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Tipo de Relatório</Label>
            <Select value={options.type} onValueChange={(value) => setOptions({ ...options, type: value as ReportOptions['type'] })}>
              <SelectTrigger id="report-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Período</Label>
            <Select value={options.period} onValueChange={(value) => setOptions({ ...options, period: value as ReportOptions['period'] })}>
              <SelectTrigger id="period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Formato de Download</Label>
            <Select value={options.format} onValueChange={(value) => setOptions({ ...options, format: value as ReportOptions['format'] })}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-muted-foreground">
            <p>
              <strong>Resumo:</strong> Você receberá um relatório em formato <strong>{options.format.toUpperCase()}</strong> contendo os dados do período <strong>{periods.find(p => p.value === options.period)?.label}</strong>.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-secondary hover:text-secondary-foreground h-10 px-4 py-2 flex-1">
            Cancelar
          </button>
          <Button onClick={handleDownload} variant="gold" className="flex-1">
            <Download size={16} />
            Baixar Relatório
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
