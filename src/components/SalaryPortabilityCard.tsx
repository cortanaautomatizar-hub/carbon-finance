import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export const SalaryPortabilityCard = () => {
  const benefits = [
    "Isenção de taxas de portabilidade",
    "Redução automática de juros",
    "Aumento de limite de crédito",
    "Prioridade em ofertas exclusivas",
    "Acesso a produtos premium",
  ];

  return (
    <Dialog>
      <Card className="overflow-hidden border border-muted/40 bg-gradient-to-br from-primary/10 via-card to-card cursor-pointer hover:shadow-md transition-shadow">
        <DialogTrigger asChild>
          <CardHeader className="cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge variant="default" className="mb-2 bg-amber-500 text-primary-foreground hover:bg-amber-500">
                  Novidade
                </Badge>
                <CardTitle className="text-lg">Portabilidade de Salário</CardTitle>
                <CardDescription className="mt-2">
                  Traga seu salário e ganhe isenção de taxas + melhores juros
                </CardDescription>
              </div>
              <div className="text-3xl">💼</div>
            </div>
          </CardHeader>
        </DialogTrigger>
      </Card>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Portabilidade de Salário</DialogTitle>
          <DialogDescription>
            Conheça os benefícios exclusivos de trazer seu salário para o Carbon Finance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resumo do Benefício */}
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
            <p className="font-semibold text-foreground mb-2">Benefício Principal:</p>
            <p className="text-sm text-muted-foreground">
              Com a portabilidade de salário, você garante as melhores condições de crédito do mercado, incluindo redução de até <span className="font-semibold text-primary">30% nos juros</span> de empréstimos e financiamentos.
            </p>
          </div>

          {/* Lista de Benefícios */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">O que você ganha:</p>
            <div className="space-y-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center size-5 rounded-full bg-emerald-500/20">
                    <Check size={14} className="text-emerald-500" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulação */}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-semibold mb-3">Exemplo de economia:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Sem portabilidade</p>
                <p className="font-semibold">2,99% a.m.</p>
              </div>
              <div className="border-l pl-3">
                <p className="text-muted-foreground">Com portabilidade</p>
                <p className="font-semibold text-emerald-500">1,99% a.m.</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Economia:</strong> R$ 1.500+ por ano em um empréstimo de R$ 100.000
            </p>
          </div>

          {/* Próximos Passos */}
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">Como funciona:</p>
            <ol className="text-sm space-y-1 text-muted-foreground">
              <li>1. Solicite a portabilidade de salário</li>
              <li>2. Envie comprovante de renda (contracheque)</li>
              <li>3. Nosso time valida em até 48 horas</li>
              <li>4. Aproveite os benefícios imediatamente</li>
            </ol>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="flex-1">
            Saber Mais
          </Button>
          <Button variant="gold" className="flex-1">
            Solicitar Agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
