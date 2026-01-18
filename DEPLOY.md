## DEPLOY — Manual de fluxo até o Vercel

Objetivo
- Padronizar o fluxo desde desenvolvimento até o Preview/Production no Vercel, garantindo testes e rollback seguros.

1) Pré-requisitos (local ou portátil)
- Node.js 18+ (pode ser portátil). Se não puder instalar, use Node portátil ou Codespaces/Gitpod.
- Git (pode usar Portable Git). Ajuste o `PATH` apenas na sessão do terminal quando usar versões portáteis.

Exemplos (PowerShell):
```powershell
$env:PATH="C:\Users\Alanderson.Barros\OneDrive - SODEXO\Documentos\node-v24.12.0-win-x64\node-v24.12.0-win-x64;" + $env:PATH
$env:PATH="C:\Users\Alanderson.Barros\OneDrive - SODEXO\Documentos\PortableGit\cmd;" + $env:PATH
```

2) Criar branch a partir do baseline seguro
- Sempre criar branch a partir do commit baseline: `f5efe5f`.

Comandos:
```bash
git fetch origin
git checkout -b feat/subscriptions-ui f5efe5f
```

Se houver mudanças locais não comitadas: use `git stash` ou crie um commit temporário. Não use `git add .` sem revisar.

3) Testar localmente (ou remoto)
- Instale dependências e rode dev:
```bash
npm install
npm run dev
# abrir http://localhost:5173
```
- Testes essenciais (ver QA em BASELINE.md):
	- Verificar `localStorage` → `carbon_finance_subscriptions` e `carbon_finance_serviceColors`.
	- Fluxos: adicionar, editar, pausar/reativar, excluir assinaturas.
	- Validações: `nome` obrigatório, `valor > 0`, `categoria` selecionada.

Alternativas quando não puder rodar local: GitHub Codespaces, Gitpod (use `.gitpod.yml`), ou abrir PR e testar Preview no Vercel.

4) Preparar commit limpo
- Stage apenas os arquivos editados:
```bash
git add src/pages/SubscriptionControl.tsx src/services/subscriptions.ts README.md BASELINE.md .gitpod.yml
git status
git commit -m "feat: controle de assinaturas — edição, persistência e data de renovação"
```

5) Push e abrir PR
- Push:
```bash
git push -u origin feat/subscriptions-ui
```
- Abra PR para `main` com título e corpo que contenha o checklist QA (copiar de `BASELINE.md`). Marque revisores.

6) Vercel — validar Preview
- Vercel cria um Preview ao abrir PR (se integrado). Monitorar logs e Preview URL.
- Configurações recomendadas do projeto Vercel:
	- Build Command: `npm run build`
	- Output Directory: `dist`
	- Node Version: 18.x (ou conforme `BASELINE.md`)
	- Desabilitar Auto Deploy para Production ou ativar Require Promotion.

7) Merge e promoção para Production
- Após revisão e testes no Preview, faça merge para `main`.
- Se o Vercel usar promoção manual, promova o Preview para Production através do painel Vercel.

8) Rollback / recuperação
- Se for preciso voltar ao baseline estável:
```bash
git checkout main
git reset --hard f5efe5f
git push -f origin main   # usar só com autorização da equipe
```
- Alternativa menos intrusiva: `git revert <merge-commit>` para preservar histórico.

9) Segurança e boas práticas
- Crie PATs com escopo mínimo e expiração curta para automações; revogue após uso.
- Não commite tokens. Revise `git status` antes de commitar.

10) Checklist rápido antes do Merge
- Branch criada a partir de `f5efe5f`.
- Testes locais / Preview aprovados.
- Commit limpo (sem arquivos não desejados).
- PR com descrição + checklist QA.
- Vercel Preview verde e testes manuais OK.

---

Se preferir, nós podemos abrir um PR com este `DEPLOY.md` automaticamente — solicite e, se quiser, forneça um PAT com escopo mínimo para a operação (recomenda-se expiração curta). Depois que eu criar o PR, você pode revogar o token.

## Como acionar o fluxo automaticamente

Quando quiser que eu execute o fluxo, diga apenas “subir mudanças” ou “abrir PR”.

Eu lerei o manual em DEPLOY.md e seguirei os passos: criar branch a partir de f5efe5f, commitar os arquivos necessários, push e (se você pedir) abrir o PR.

Observação: para eu abrir o PR automaticamente preciso de um PAT (scope `public_repo`/`repo`); sem PAT eu só executo até o push local/remoto ou eu lhe oriento passo a passo.

**Resumo rápido**

- Contexto: branch a partir de `f5efe5f`; testar localmente ou via Preview Vercel.
- Salvar trabalho não comitado (stash):

```bash
git stash push -u -m "wip: minhas alterações"
```

- Criar branch a partir do baseline e aplicar mudanças:

```bash
git fetch origin
git checkout -b feat/subscriptions-ui f5efe5f
git stash pop
```

- Stage seletivo e commit (revisar antes de adicionar):

```bash
git add src/pages/SubscriptionControl.tsx src/services/subscriptions.ts README.md BASELINE.md .gitpod.yml DEPLOY.md
git commit -m "feat: controle de assinaturas — docs: adicionar resumo rápido em DEPLOY.md"
```

- Push e abrir PR:

```bash
git push -u origin feat/subscriptions-ui
# abrir PR no GitHub: head=feat/subscriptions-ui -> base=main
```

- Observações rápidas:
	- Se houver conflitos ao `stash pop`, resolver, `git add` e `git commit`.
	- Se o commit já existir em `main`, crie a branch a partir do commit atual: `git branch feat/subscriptions-ui` e abra PR a partir dela.

