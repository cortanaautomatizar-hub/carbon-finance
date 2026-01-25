import { useState } from 'react';
import { calcularSaldoConsolidado, formatarMoedaBRL, type Transacao } from '@/lib/saldoConsolidado';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

/**
 * Componente de exemplo que demonstra o uso da função de saldo consolidado
 * seguindo as diretrizes de desenvolvimento do Carbon Finance.
 */
export function ExemploSaldoConsolidado() {
  // Exemplo de transações do usuário
  const [transacoes] = useState<Transacao[]>([
    { tipo: 'entrada', valor: 5000.00, descricao: 'Salário', data: '2026-01-01' },
    { tipo: 'entrada', valor: 1200.00, descricao: 'Freelance', data: '2026-01-15' },
    { tipo: 'saida', valor: 1500.00, descricao: 'Aluguel', data: '2026-01-05' },
    { tipo: 'saida', valor: 450.75, descricao: 'Supermercado', data: '2026-01-10' },
    { tipo: 'saida', valor: 89.90, descricao: 'Internet', data: '2026-01-12' },
    { tipo: 'saida', valor: 250.50, descricao: 'Conta de luz', data: '2026-01-15' },
  ]);

  // Calcular saldo usando a função com precisão decimal
  const resultado = calcularSaldoConsolidado(transacoes);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Saldo Consolidado</CardTitle>
          <CardDescription>
            Cálculo preciso usando decimal.js para evitar erros de arredondamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card de Saldo Total */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <DollarSign className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
              <p className="text-3xl font-bold text-foreground">
                {resultado.saldoFormatado}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Precisão garantida
              </p>
            </div>

            {/* Card de Entradas */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
              <TrendingUp className="w-8 h-8 text-success mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Total de Entradas</p>
              <p className="text-2xl font-bold text-success">
                {formatarMoedaBRL(resultado.totalEntradas)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {transacoes.filter(t => t.tipo === 'entrada').length} transações
              </p>
            </div>

            {/* Card de Saídas */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-lg border border-destructive/20">
              <TrendingDown className="w-8 h-8 text-destructive mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Total de Saídas</p>
              <p className="text-2xl font-bold text-destructive">
                {formatarMoedaBRL(resultado.totalSaidas)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {transacoes.filter(t => t.tipo === 'saida').length} transações
              </p>
            </div>
          </div>

          {/* Lista de Transações */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Transações Recentes</h3>
            <div className="space-y-2">
              {transacoes.map((transacao, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {transacao.tipo === 'entrada' ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium">{transacao.descricao}</p>
                      <p className="text-xs text-muted-foreground">{transacao.data}</p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transacao.tipo === 'entrada' ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {transacao.tipo === 'entrada' ? '+' : '-'}{formatarMoedaBRL(transacao.valor)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Informações Técnicas */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">ℹ️ Precisão Matemática</h4>
            <p className="text-xs text-muted-foreground">
              Esta implementação utiliza <code className="bg-primary/10 px-1 rounded">decimal.js</code> para 
              garantir cálculos financeiros precisos sem erros de arredondamento de ponto flutuante.
              Todos os valores são formatados no padrão brasileiro (BRL, R$) conforme diretrizes do projeto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
