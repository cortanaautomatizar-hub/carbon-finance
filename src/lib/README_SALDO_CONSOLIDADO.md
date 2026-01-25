# 💰 Saldo Consolidado - Cálculos Financeiros Precisos

Implementação de funções para cálculos financeiros com precisão decimal, seguindo as diretrizes do projeto Carbon Finance.

## 📚 Funcionalidades

### ✨ `calcularSaldoConsolidado(transacoes: Transacao[])`

Calcula o saldo consolidado de um usuário a partir de um array de transações, utilizando **decimal.js** para evitar erros de arredondamento.

**Parâmetros:**
- `transacoes`: Array de objetos com tipo `'entrada'` ou `'saida'` e valor numérico

**Retorna:**
```typescript
{
  saldoFinal: number;        // Saldo total (entradas - saídas)
  totalEntradas: number;     // Soma de todas as entradas
  totalSaidas: number;       // Soma de todas as saídas
  saldoFormatado: string;    // Valor formatado em BRL (R$ 1.234,56)
}
```

**Exemplo:**
```typescript
import { calcularSaldoConsolidado } from '@/lib/saldoConsolidado';

const transacoes = [
  { tipo: 'entrada', valor: 1500.50, descricao: 'Salário' },
  { tipo: 'saida', valor: 350.75, descricao: 'Conta de luz' },
  { tipo: 'saida', valor: 89.90, descricao: 'Supermercado' }
];

const resultado = calcularSaldoConsolidado(transacoes);
console.log(resultado);
// {
//   saldoFinal: 1059.85,
//   totalEntradas: 1500.50,
//   totalSaidas: 440.65,
//   saldoFormatado: "R$ 1.059,85"
// }
```

---

### 💵 `formatarMoedaBRL(valor: number)`

Formata um valor numérico para o padrão monetário brasileiro (BRL).

**Parâmetros:**
- `valor`: Número a ser formatado

**Retorna:** String formatada no padrão `"R$ 1.234,56"`

**Exemplo:**
```typescript
import { formatarMoedaBRL } from '@/lib/saldoConsolidado';

formatarMoedaBRL(1234.56);  // "R$ 1.234,56"
formatarMoedaBRL(-500.75);  // "R$ -500,75"
formatarMoedaBRL(0);        // "R$ 0,00"
```

---

### 📈 `calcularJurosCompostos(valorInicial, taxaJurosMensal, meses)`

Calcula juros compostos com precisão decimal, útil para investimentos e empréstimos.

**Parâmetros:**
- `valorInicial`: Capital inicial
- `taxaJurosMensal`: Taxa de juros mensal (ex: 0.05 para 5%)
- `meses`: Número de meses

**Fórmula:** `M = C × (1 + i)^n`

**Exemplo:**
```typescript
import { calcularJurosCompostos, formatarMoedaBRL } from '@/lib/saldoConsolidado';

const montante = calcularJurosCompostos(1000, 0.01, 12);
console.log(formatarMoedaBRL(montante)); // "R$ 1.126,83"
```

---

## 🔒 Por Que Usar decimal.js?

### ❌ Problema com Float Simples

```typescript
// JavaScript nativo tem problemas de precisão:
0.1 + 0.2 === 0.3  // false!
0.1 + 0.2          // 0.30000000000000004

// Em finanças, isso gera erros de centavos:
let saldo = 0.1 + 0.2;
console.log(saldo.toFixed(2)); // "0.30" (parece correto, mas internamente está errado)
```

### ✅ Solução com decimal.js

```typescript
import Decimal from 'decimal.js';

const a = new Decimal(0.1);
const b = new Decimal(0.2);
const resultado = a.plus(b);

console.log(resultado.toString()); // "0.3" (precisão exata!)
```

---

## 🧪 Testes

Execute os testes para verificar a precisão:

```bash
npm run test -- saldoConsolidado
```

**Cobertura de Testes:**
- ✅ Cálculo correto de entradas e saídas
- ✅ Prevenção de erros de arredondamento (0.1 + 0.2 - 0.3 = 0.00)
- ✅ Saldo negativo
- ✅ Array vazio
- ✅ Formatação BRL (positivo, negativo, zero)
- ✅ Juros compostos com precisão

---

## 📖 Exemplo de Uso em Componente React

```tsx
import { calcularSaldoConsolidado } from '@/lib/saldoConsolidado';
import { ExemploSaldoConsolidado } from '@/components/ExemploSaldoConsolidado';

function MinhasPaginas() {
  return <ExemploSaldoConsolidado />;
}
```

Veja o componente completo em: [`src/components/ExemploSaldoConsolidado.tsx`](../components/ExemploSaldoConsolidado.tsx)

---

## 📐 Diretrizes de Desenvolvimento

Esta implementação segue as **Regras de Desenvolvimento do Carbon Finance**:

1. **✅ Moeda e Formatação:** Sempre BRL (R$), 2 casas decimais, separador de milhar
2. **✅ Precisão Matemática:** decimal.js para evitar erros de ponto flutuante
3. **✅ Segurança:** Dados financeiros tratados como sensíveis (não logados)
4. **✅ Nomenclatura:** Nomes descritivos em português

Referência: [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md)

---

## 🔧 Instalação

A biblioteca decimal.js já está incluída nas dependências do projeto:

```bash
npm install decimal.js
```

---

## 📚 Referências

- [decimal.js - Documentação Oficial](https://mikemcl.github.io/decimal.js/)
- [Floating Point Math - 0.30000000000000004.com](https://0.30000000000000004.com/)
- [MDN - Intl.NumberFormat](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

---

**💡 Dica:** Sempre use estas funções para cálculos financeiros no Carbon Finance. Nunca use operações aritméticas diretas (`+`, `-`, `*`, `/`) com valores monetários!
