import { describe, it, expect } from 'vitest';
import { 
  calcularSaldoConsolidado, 
  formatarMoedaBRL,
  calcularJurosCompostos,
  type Transacao 
} from '../saldoConsolidado';

describe('Cálculo de Saldo Consolidado', () => {
  it('deve calcular corretamente o saldo com entradas e saídas', () => {
    const transacoes: Transacao[] = [
      { tipo: 'entrada', valor: 1500.50, descricao: 'Salário' },
      { tipo: 'saida', valor: 350.75, descricao: 'Conta de luz' },
      { tipo: 'saida', valor: 89.90, descricao: 'Supermercado' },
    ];

    const resultado = calcularSaldoConsolidado(transacoes);

    expect(resultado.saldoFinal).toBe(1059.85);
    expect(resultado.totalEntradas).toBe(1500.50);
    expect(resultado.totalSaidas).toBe(440.65);
    expect(resultado.saldoFormatado).toContain('1.059,85');
  });

  it('deve evitar erros de arredondamento com valores decimais', () => {
    const transacoes: Transacao[] = [
      { tipo: 'entrada', valor: 0.1 },
      { tipo: 'entrada', valor: 0.2 },
      { tipo: 'saida', valor: 0.3 },
    ];

    const resultado = calcularSaldoConsolidado(transacoes);

    // Com float simples, 0.1 + 0.2 - 0.3 = 0.00000000000000005551115123125783
    // Com Decimal.js, obtemos 0.00 exato
    expect(resultado.saldoFinal).toBe(0.00);
  });

  it('deve lidar com saldo negativo', () => {
    const transacoes: Transacao[] = [
      { tipo: 'entrada', valor: 100 },
      { tipo: 'saida', valor: 250.50 },
    ];

    const resultado = calcularSaldoConsolidado(transacoes);

    expect(resultado.saldoFinal).toBe(-150.50);
    expect(resultado.saldoFormatado).toContain('-');
    expect(resultado.saldoFormatado).toContain('150,50');
  });

  it('deve retornar zero para array vazio', () => {
    const resultado = calcularSaldoConsolidado([]);

    expect(resultado.saldoFinal).toBe(0);
    expect(resultado.totalEntradas).toBe(0);
    expect(resultado.totalSaidas).toBe(0);
  });

  it('deve calcular apenas entradas corretamente', () => {
    const transacoes: Transacao[] = [
      { tipo: 'entrada', valor: 500 },
      { tipo: 'entrada', valor: 300.75 },
    ];

    const resultado = calcularSaldoConsolidado(transacoes);

    expect(resultado.saldoFinal).toBe(800.75);
    expect(resultado.totalEntradas).toBe(800.75);
    expect(resultado.totalSaidas).toBe(0);
  });
});

describe('Formatação de Moeda BRL', () => {
  it('deve formatar valores positivos corretamente', () => {
    const formatado1 = formatarMoedaBRL(1234.56);
    const formatado2 = formatarMoedaBRL(1000000);
    
    expect(formatado1).toContain('1.234,56');
    expect(formatado2).toContain('1.000.000,00');
  });

  it('deve formatar valores negativos corretamente', () => {
    const formatado = formatarMoedaBRL(-500.75);
    expect(formatado).toContain('-');
    expect(formatado).toContain('500,75');
  });

  it('deve formatar zero corretamente', () => {
    const formatado = formatarMoedaBRL(0);
    expect(formatado).toContain('0,00');
  });

  it('deve sempre exibir duas casas decimais', () => {
    expect(formatarMoedaBRL(100)).toContain('100,00');
    expect(formatarMoedaBRL(99.9)).toContain('99,90');
  });
});

describe('Cálculo de Juros Compostos', () => {
  it('deve calcular juros compostos com precisão', () => {
    const montante = calcularJurosCompostos(1000, 0.01, 12);
    
    // Fórmula: M = C * (1 + i)^n = 1000 * (1.01)^12 ≈ 1126.83
    expect(montante).toBeCloseTo(1126.83, 2);
  });

  it('deve retornar o valor inicial quando taxa é zero', () => {
    const montante = calcularJurosCompostos(1000, 0, 12);
    expect(montante).toBe(1000);
  });

  it('deve calcular corretamente para diferentes períodos', () => {
    const montante6Meses = calcularJurosCompostos(5000, 0.005, 6);
    const montante12Meses = calcularJurosCompostos(5000, 0.005, 12);
    
    expect(montante12Meses).toBeGreaterThan(montante6Meses);
  });
});
