import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, CalendarClock } from "lucide-react";
import { NewLoanForm } from "@/components/NewLoanForm";
import { LoanReportDialog } from "@/components/LoanReportDialog";
import { LoanFilters } from "@/components/LoanFilters";
import { LoanCard } from "@/components/LoanCard";
import { LoanSimulator } from "@/components/LoanSimulator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const loans = [
  {
    id: 1,
    title: "Crédito Pessoal",
    contract: "Contrato #482910-CP",
    status: "Em dia",
    statusVariant: "secondary" as const,
    original: "R$ 12.000,00",
    balance: "R$ 6.000,00",
    installment: "R$ 500,00",
    due: "10 Out",
    progressLabel: "12/24",
    progress: 50,
    type: "personal",
  },
  {
    id: 2,
    title: "Financiamento Veículo",
    contract: "Contrato #990212-FV",
    status: "Em dia",
    statusVariant: "secondary" as const,
    original: "R$ 45.000,00",
    balance: "R$ 39.000,00",
    installment: "R$ 750,00",
    due: "15 Out",
    progressLabel: "5/48",
    progress: 10,
    type: "vehicle",
  },
  {
    id: 3,
    title: "Crédito com Garantia",
    contract: "Contrato #110022-CG",
    status: "Finalizado",
    statusVariant: "outline" as const,
    original: "R$ 80.000,00",
    balance: "R$ 0,00",
    installment: "R$ 1.200,00",
    due: "Pago",
    progressLabel: "60/60",
    progress: 100,
    type: "guarantee",
  },
];

const filterOptions = [
  { id: "all", label: "Todos", value: "all" },
  { id: "personal", label: "Crédito Pessoal", value: "personal" },
  { id: "vehicle", label: "Veículo", value: "vehicle" },
  { id: "real-estate", label: "Imobiliário", value: "real-estate" },
  { id: "revolving", label: "Crédito Rotativo", value: "revolving" },
  { id: "guarantee", label: "Com Garantia", value: "guarantee" },
];

const tips = [
  "Priorize quitar dívidas com juros maiores.",
  "Antecipar parcelas pode reduzir o CET total.",
  "Pagamentos em dia ajudam no score e liberam limites maiores.",
];

const LoansPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Calcular totais dinâmicos
  const totalDebt = loans.reduce((sum, loan) => {
    const balance = parseFloat(loan.balance.replace(/[^\d.]/g, ''));
    return sum + balance;
  }, 0);

  const monthlyCommitment = loans.reduce((sum, loan) => {
    const installment = parseFloat(loan.installment.replace(/[^\d.]/g, ''));
    return sum + installment;
  }, 0);

  const availableLimit = 100000;
  const usedCredit = loans.reduce((sum, loan) => {
    const original = parseFloat(loan.original.replace(/[^\d.]/g, ''));
    return sum + original;
  }, 0);
  const creditAvailable = availableLimit - usedCredit;

  const nextDueDate = "10 de janeiro";
  const daysUntilDue = 10;

  const debtVariation = -2.5;
  const isDebtDecreasing = debtVariation < 0;

  const handleSimulateCredit = () => {
    const simulator = document.getElementById("credit-simulator");
    if (simulator) {
      simulator.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredLoans = activeFilter === "all" 
    ? loans 
    : loans.filter(loan => loan.type === activeFilter);

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    const daysA = parseInt(a.due) || 999;
    const daysB = parseInt(b.due) || 999;
    return daysA - daysB;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 justify-between md:flex-row md:items-start">
        <div>
          <h1 className="text-3xl font-semibold">Meus Empréstimos</h1>
          <p className="text-muted-foreground">Gerencie seus contratos ativos e acompanhe a evolução de suas dívidas. Crie novos empréstimos e visualize relatórios detalhados.</p>
        </div>
        <div className="flex gap-2">
          <NewLoanForm />
          <LoanReportDialog />
        </div>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Dívida Total</CardTitle>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-semibold">R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              {isDebtDecreasing ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                  <ArrowDownRight size={14} />
                  {Math.abs(debtVariation).toFixed(1)}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-400">
                  <ArrowDownRight size={14} className="rotate-180" />
                  {Math.abs(debtVariation).toFixed(1)}%
                </span>
              )}
            </div>
            <CardDescription className="mt-3">vs mês anterior</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Comprometimento Mensal</CardTitle>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-semibold">R$ {monthlyCommitment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/15">
                <CalendarClock size={16} className="text-amber-400" />
              </div>
            </div>
            <CardDescription className="mt-3">
              Próximo vencimento em <span className="font-semibold text-foreground">{daysUntilDue} dias</span> ({nextDueDate})
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-primary/5 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Limite Disponível</CardTitle>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-semibold">R$ {creditAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <Button 
              variant="link" 
              size="sm" 
              className="px-0 text-primary hover:text-primary/80 mt-3 h-auto"
              onClick={handleSimulateCredit}
            >
              Simular novo crédito →
            </Button>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span className="size-2 rounded-full bg-yellow-400" />
                Contratos ativos ({filteredLoans.length})
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setActiveFilter("all")}
              >
                Próximo vencimento
              </Button>
            </div>
            
            <LoanFilters 
              filters={filterOptions}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {sortedLoans.length > 0 ? (
            sortedLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                id={loan.id}
                title={loan.title}
                contract={loan.contract}
                status={loan.status as "Em dia" | "Finalizado" | "Atrasado"}
                statusVariant={loan.statusVariant}
                original={loan.original}
                balance={loan.balance}
                installment={loan.installment}
                due={loan.due}
                progressLabel={loan.progressLabel}
                progress={loan.progress}
              />
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">Nenhum empréstimo encontrado para este filtro.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <LoanSimulator />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dicas financeiras</CardTitle>
              <CardDescription>Boas práticas para economizar com juros.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {tips.map((tip) => (
                <div key={tip} className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-1.5 rounded-full bg-amber-400" />
                  <p>{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-muted/40 bg-gradient-to-br from-primary/10 via-card to-card">
            <CardContent className="p-6 space-y-2">
              <Badge variant="default" className="bg-amber-500 text-primary-foreground hover:bg-amber-500">Novidade</Badge>
              <CardTitle className="text-lg">Portabilidade de Salário</CardTitle>
              <CardDescription>Traga seu salário e ganhe melhores taxas nos seus empréstimos.</CardDescription>
              <Button variant="link" className="px-0 text-primary">Saiba mais</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
