# chore: npm audit fix --force (security) + tests to satisfy coverage thresholds

## O que está neste PR
- Atualiza dependências para corrigir vulnerabilidades reportadas pelo `npm audit` (ex.: `vitest` → `4.0.18`, `@vitest/coverage-v8` → `4.0.18`).
- Adiciona testes em áreas críticas (`src/lib` e `src/services`) para elevar a cobertura e evitar regressões.
- Ajustes de configuração:
  - `vitest.config.ts` (thresholds de coverage por glob: `src/lib/**`, `src/services/**`).
  - Scripts: `format`, `lint:fix`, `test:coverage`.
  - `.prettierrc`, `lint-staged` e integração no hook `.husky/pre-commit`.
  - CI: `.github/workflows/ci.yml` recebe checks de Prettier e roda testes com coverage.

## Por que
- Remedia vulnerabilidades de segurança detectadas pelo `npm audit` de forma controlada e testada (aplicado em branch isolada).
- Garante estabilidade (testes rodando com Vitest v4) e define uma meta de cobertura nas pastas críticas sem travar o CI globalmente.

## Validação local realizada
- `npm ci` ✅
- `npm test` (Vitest v4) ✅ (todos os testes passaram localmente)
- `npm run test -- --coverage` ✅ (coverage gerado e thresholds aplicados)
- `npm audit` após fix: não foram encontradas vulnerabilidades críticas no ambiente de simulação ✅

## Checklist (a confirmar antes do merge)
- [ ] CI (lint + prettier check + tests + coverage) passou no PR
- [ ] Revisão humana do diff em `package.json` / `package-lock.json`
- [ ] Confirmar que *não* há mudanças acidentais em arquivos de produção
- [ ] Preferência de merge: **Squash and merge** e deletar a branch depois

## Riscos / Observações
- O upgrade do **Vitest** é uma mudança major (v1 → v4). Testes e ajustes foram executados na branch, mas é importante conferir o CI do PR antes de mesclar.
- Se houver regressões no CI, revertemos a branch e eu corrijo as falhas em uma branch de correção.

## Como reproduzir localmente (se quiser validar)
```bash
# na branch chore/audit-fix-force (ou atualize/copie as mudanças localmente)
git fetch origin
git checkout chore/audit-fix-force
npm ci
npm run lint
npm test
npm run test -- --coverage
npm audit
```

---

Se quiser, adicione reviewers `@alanderson` e labels: `chore`, `security`, `ci`, `tests`.

> Nota: o arquivo de diff completo desta branch foi salvo em `audit-simulation/audit-fix-branch.diff` para revisão detalhada.
