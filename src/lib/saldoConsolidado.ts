import Decimal from 'decimal.js';

/**
 * Tipo de transação financeira
 */
export interface Transacao {
  tipo: 'entrada' | 'saida';
  valor: number;
  descricao?: string;
  data?: string;
}

/**
 * Resultado do cálculo de saldo consolidado
 */
export interface SaldoConsolidado {
  saldoFinal: number;
  totalEntradas: number;
  totalSaidas: number;
  saldoFormatado: string;
}

/**
 * Calcula o saldo consolidado de um usuário com precisão decimal.
 * 
 * Esta função utiliza decimal.js para evitar erros de arredondamento
 * em operações com valores monetários, seguindo as diretrizes de
 * precisão matemática do projeto Carbon Finance.
 * 
 * @param transacoes - Array de transações com tipo 'entrada' ou 'saida'
 * @returns Objeto com saldo final, totais e valor formatado em BRL
 * 
 * @example
 * ```typescript
 * const transacoes = [
 *   { tipo: 'entrada', valor: 1500.50, descricao: 'Salário' },
 *   { tipo: 'saida', valor: 350.75, descricao: 'Conta de luz' },
 *   { tipo: 'saida', valor: 89.90, descricao: 'Supermercado' }
 * ];
 * 
 * const resultado = calcularSaldoConsolidado(transacoes);
 * console.log(resultado.saldoFormatado); // "R$ 1.059,85"
 * ```
 */
export function calcularSaldoConsolidado(transacoes: Transacao[]): SaldoConsolidado {
  // Configurar Decimal.js para trabalhar com 2 casas decimais (centavos)
  Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

  // Inicializar acumuladores com precisão decimal
  let totalEntradas = new Decimal(0);
  let totalSaidas = new Decimal(0);

  // Processar cada transação com precisão decimal
  transacoes.forEach((transacao) => {
    const valorDecimal = new Decimal(transacao.valor);

    if (transacao.tipo === 'entrada') {
      totalEntradas = totalEntradas.plus(valorDecimal);
    } else if (transacao.tipo === 'saida') {
      totalSaidas = totalSaidas.plus(valorDecimal);
    }
  });

  // Calcular saldo final: entradas - saídas
  const saldoFinal = totalEntradas.minus(totalSaidas);

  // Formatar valor em padrão brasileiro (BRL)
  const saldoFormatado = formatarMoedaBRL(saldoFinal.toNumber());

  return {
    saldoFinal: saldoFinal.toDecimalPlaces(2).toNumber(),
    totalEntradas: totalEntradas.toDecimalPlaces(2).toNumber(),
    totalSaidas: totalSaidas.toDecimalPlaces(2).toNumber(),
    saldoFormatado,
  };
}

/**
 * Formata um valor numérico para o padrão monetário brasileiro (BRL).
 * 
 * @param valor - Valor numérico a ser formatado
 * @returns String formatada no padrão "R$ 1.234,56"
 * 
 * @example
 * ```typescript
 * formatarMoedaBRL(1234.56); // "R$ 1.234,56"
 * formatarMoedaBRL(-500.75); // "R$ -500,75"
 * ```
 */
export function formatarMoedaBRL(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

/**
 * Calcula juros compostos com precisão decimal.
 * Útil para cálculos de investimentos e empréstimos.
 * 
 * @param valorInicial - Capital inicial
 * @param taxaJurosMensal - Taxa de juros mensal (ex: 0.05 para 5%)
 * @param meses - Número de meses
 * @returns Valor final com juros aplicados
 * 
 * @example
 * ```typescript
 * const montante = calcularJurosCompostos(1000, 0.01, 12);
 * console.log(formatarMoedaBRL(montante)); // Aprox. "R$ 1.126,83"
 * ```
 */
export function calcularJurosCompostos(
  valorInicial: number,
  taxaJurosMensal: number,
  meses: number
): number {
  Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

  const principal = new Decimal(valorInicial);
  const taxa = new Decimal(1).plus(taxaJurosMensal);
  const montante = principal.times(taxa.pow(meses));

  return montante.toDecimalPlaces(2).toNumber();
}
