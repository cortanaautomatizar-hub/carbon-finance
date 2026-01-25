import { useMemo } from 'react';
import { calcularSaldoConsolidado } from '@/lib/saldoConsolidado';

/**
 * Hook profissional para calcular o saldo consolidado do usuário.
 * Recebe um array de transações com campo `amount` (positivo = entrada, negativo = saída)
 */
export function useSaldoConsolidado(transacoes: Array<{ amount: number }>) {
  const resultado = useMemo(() => {
    const transacoesFormatadas = transacoes.map((t) => ({
      tipo: t.amount >= 0 ? 'entrada' : 'saida',
      valor: Math.abs(t.amount),
    }));

    return calcularSaldoConsolidado(transacoesFormatadas as any);
  }, [transacoes]);

  return resultado;
}
