import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Wallet, Download, CreditCard } from "lucide-react";

interface LoanCardProps {
  id: number;
  title: string;
  contract: string;
  status: "Em dia" | "Finalizado" | "Atrasado";
  statusVariant: "secondary" | "outline" | "default";
  original: string;
  balance: string;
  installment: string;
  due: string;
  progressLabel: string;
  progress: number;
}

export const LoanCard = ({
  id,
  title,
  contract,
  status,
  statusVariant,
  original,
  balance,
  installment,
  due,
  progressLabel,
  progress,
}: LoanCardProps) => {
  const isCompleted = progress === 100;

  return (
    <Card className="border-border bg-card/80 hover:bg-card/95 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate">{contract}</p>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </div>
        <Badge variant={statusVariant} className="shrink-0">{status}</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Detalhes do empréstimo em grid */}
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-4">
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase tracking-wide">Valor original</p>
            <p className="text-foreground font-semibold text-base">{original}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase tracking-wide">Saldo devedor</p>
            <p className="text-foreground font-semibold text-base">{balance}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase tracking-wide">Parcela</p>
            <p className="text-foreground font-semibold text-base">{installment}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase tracking-wide">Próximo vencimento</p>
            <p className="text-foreground font-semibold text-base">{due}</p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Progresso do pagamento</span>
            <span className="text-foreground font-semibold">{progressLabel}</span>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-2",
              isCompleted && "bg-emerald-500/15"
            )}
          />
          <p className="text-xs text-muted-foreground text-right">{progress}% concluído</p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        {/* Dialog Extrato */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="muted" className="w-full sm:w-auto" size="sm">
              <Download size={14} />
              Extrato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Extrato - {title}</DialogTitle>
              <DialogDescription>{contract}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Valor Original</p>
                  <p className="font-semibold">{original}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Saldo Devedor</p>
                  <p className="font-semibold">{balance}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Taxa (a.m.)</p>
                  <p className="font-semibold">1,99%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Próximo Vencimento</p>
                  <p className="font-semibold">{due}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-3">Últimas movimentações:</p>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                      <span>Parcela {progressLabel.split('/')[0]} - Paga</span>
                      <span className="text-emerald-400 font-medium">{installment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" variant="gold">Baixar Extrato (PDF)</Button>
          </DialogContent>
        </Dialog>

        {/* Dialog Antecipar/Quitar */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant={isCompleted ? "outline" : "gold"} 
              className="flex-1"
              size="sm"
            >
              <CreditCard size={14} />
              {isCompleted ? "Ver Histórico" : "Antecipar / Quitar"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isCompleted ? "Histórico Completo" : "Antecipar ou Quitar"}</DialogTitle>
              <DialogDescription>{title}</DialogDescription>
            </DialogHeader>
            
            {isCompleted ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4">
                  <p className="text-sm text-emerald-400 font-semibold">✓ Empréstimo finalizado</p>
                  <p className="text-xs text-muted-foreground mt-1">Todas as {progressLabel.split('/')[1]} parcelas foram pagas.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Resumo:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground text-xs">Total Pago</p>
                      <p className="font-semibold">{original}</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground text-xs">Encerrado em</p>
                      <p className="font-semibold">Dez 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Saldo a Quitar</p>
                  <p className="text-2xl font-bold text-primary">{balance}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Antecipar</p>
                    <Button variant="outline" size="sm" className="w-full">1 Parcela</Button>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Quitação</p>
                    <Button variant="gold" size="sm" className="w-full">Total</Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
