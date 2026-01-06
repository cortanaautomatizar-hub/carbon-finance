import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ArrowDownRight, CalendarClock, Landmark, Wallet } from "lucide-react";
import { NewLoanForm } from "@/components/NewLoanForm";
import { LoanReportDialog } from "@/components/LoanReportDialog";

const stats = [
  {
    title: "Dívida total",
    value: "R$ 45.200,00",
    helper: "-2,5% vs mês anterior",
    trend: "down" as const,
  },
  {
    title: "Comprometimento mensal",
    value: "R$ 1.250,00",
    helper: "Próximo vencimento em 10 dias",
    icon: <CalendarClock className="text-muted-foreground" size={18} />,
    trend: undefined as undefined,
  },
  {
    title: "Limite disponível",
    value: "R$ 12.000,00",
    helper: "Simule novo crédito",
    highlight: true,
    trend: undefined as undefined,
  },
];

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
  },
];

const tips = [
  "Priorize quitar dívidas com juros maiores.",
  "Antecipar parcelas pode reduzir o CET total.",
  "Pagamentos em dia ajudam no score e liberam limites maiores.",
];

const LoansPage = () => {
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

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={cn(stat.highlight && "bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-primary/5 border-yellow-500/30")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">{stat.title}</CardTitle>
                {('icon' in stat) && stat.icon}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold">{stat.value}</span>
                {('trend' in stat) && stat.trend === "down" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-400">
                    <ArrowDownRight size={14} />
                    {('helper' in stat) && stat.helper}
                  </span>
                )}
              </div>
              {!('trend' in stat) && ('helper' in stat) && <CardDescription>{stat.helper}</CardDescription>}
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <span className="size-2 rounded-full bg-yellow-400" />
              Contratos ativos
            </div>
            <Button variant="secondary" size="sm">Próximo vencimento</Button>
          </div>

          {loans.map((loan) => (
            <Card key={loan.id} className="border-border bg-card/80">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{loan.contract}</p>
                    <CardTitle className="text-lg">{loan.title}</CardTitle>
                  </div>
                </div>
                <Badge variant={loan.statusVariant}>{loan.status}</Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-4">
                  <div className="space-y-1">
                    <p>Valor original</p>
                    <p className="text-foreground font-semibold">{loan.original}</p>
                  </div>
                  <div className="space-y-1">
                    <p>Saldo devedor</p>
                    <p className="text-foreground font-semibold">{loan.balance}</p>
                  </div>
                  <div className="space-y-1">
                    <p>Parcela</p>
                    <p className="text-foreground font-semibold">{loan.installment}</p>
                  </div>
                  <div className="space-y-1">
                    <p>Vencimento</p>
                    <p className="text-foreground font-semibold">{loan.due}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progresso do pagamento</span>
                    <span className="text-foreground font-semibold">{loan.progressLabel}</span>
                  </div>
                  <Progress value={loan.progress} className={cn(loan.progress === 100 && "bg-emerald-500/15")}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 sm:flex-row">
                <Button variant="muted" className="w-full">Extrato</Button>
                <Button variant={loan.status === "Finalizado" ? "outline" : "gold"} className="w-full">
                  {loan.status === "Finalizado" ? "Ver histórico completo" : "Antecipar / Quitar"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card to-card">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Landmark size={18} className="text-amber-400" />
                Simular Empréstimo
              </div>
              <CardTitle className="text-xl">Confira ofertas pré-aprovadas</CardTitle>
              <CardDescription>Defina o valor desejado e o prazo para ver a estimativa da parcela.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Valor desejado</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                  <Input defaultValue="5000" type="number" className="bg-background pl-10" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Número de parcelas</label>
                <Input defaultValue="12" type="number" className="bg-background" />
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-background/50 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimativa da parcela</span>
                  <span className="font-semibold">R$ 468,90</span>
                </div>
                <p className="text-xs text-amber-400">Taxa simulada: 1,9% a.m.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="gold">Ver ofertas disponíveis</Button>
            </CardFooter>
          </Card>

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
              <CardTitle className="text-lg">Portabilidade de salário</CardTitle>
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
