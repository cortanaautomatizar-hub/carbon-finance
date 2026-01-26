import { describe, it, expect } from 'vitest';
import { calcularJurosCompostos, calcularSaldoConsolidado } from '../saldoConsolidado';

describe('Juros compostos e arredondamento', () => {
  it('calcula juros com taxa negativa (decrescente)', () => {
    const montante = calcularJurosCompostos(1000, -0.01, 12);
    expect(montante).toBeCloseTo(1000 * Math.pow(0.99, 12), 2);
  });

  it('aplica arredondamento half-up corretamente', () => {
    const resultado = calcularSaldoConsolidado([{ tipo: 'entrada', valor: 0.005 } as any]);
    expect(resultado.saldoFinal).toBe(0.01);
  });

  it('lida com valores grandes sem perda de precisão', () => {
    const resultado = calcularSaldoConsolidado([
      { tipo: 'entrada', valor: 1000000000.123 },
      { tipo: 'saida', valor: 0.123 }
    ] as any);

    expect(resultado.saldoFinal).toBeCloseTo(1000000000.00, 2);
  });
});
