import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Landmark } from "lucide-react";

export const LoanSimulator = () => {
  const [desiredAmount, setDesiredAmount] = useState(5000);
  const [installments, setInstallments] = useState(12);

  // Cálculo de taxa estimada (exemplo)
  const monthlyRate = 1.99;
  const monthlyPayment = (desiredAmount / installments) * (1 + (monthlyRate / 100));
  const totalCost = monthlyPayment * installments;
  const totalInterest = totalCost - desiredAmount;

  return (
    <Card id="credit-simulator" className="border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card to-card scroll-mt-20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Landmark size={18} className="text-amber-400" />
          <div>
            <CardTitle className="text-xl">Simular Crédito</CardTitle>
            <CardDescription>Confira ofertas pré-aprovadas para você</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Valor Desejado */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">Valor desejado</label>
            <span className="text-2xl font-bold text-primary">R$ {desiredAmount.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
          </div>
          <Slider
            value={[desiredAmount]}
            onValueChange={(value) => setDesiredAmount(value[0])}
            min={1000}
            max={100000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>R$ 1.000</span>
            <span>R$ 100.000</span>
          </div>
        </div>

        {/* Número de Parcelas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">Número de parcelas</label>
            <span className="text-2xl font-bold text-primary">{installments}x</span>
          </div>
          <Slider
            value={[installments]}
            onValueChange={(value) => setInstallments(value[0])}
            min={6}
            max={84}
            step={6}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>6 meses</span>
            <span>84 meses</span>
          </div>
        </div>

        {/* Estimativa de Custos */}
        <div className="space-y-3 border-t pt-4">
          <p className="text-sm font-semibold text-foreground">Estimativa de custos:</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Parcela mensal</p>
              <p className="text-lg font-bold text-primary">R$ {monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Taxa (a.m.)</p>
              <p className="text-lg font-bold">{monthlyRate.toFixed(2)}%</p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total a pagar</span>
              <span className="font-semibold">R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total de juros</span>
              <span className="font-semibold text-amber-400">+ R$ {totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" variant="gold">
          Ver ofertas disponíveis
        </Button>
      </CardFooter>
    </Card>
  );
};
