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

## Supabase — Setup e migrações

Adicionar o Supabase ao projeto (banco + Auth) envolve 3 passos principais: criar o projeto no painel Supabase, aplicar as migrações SQL e fornecer as chaves como variáveis de ambiente ao build/runtime.

- 1) Criar projeto Supabase
	- No painel Supabase, crie um novo projeto e anote o `Project URL` e a `anon public` key.

- 2) Aplicar migrações
	- Opção A — Console SQL (rápido): abra o SQL Editor do projeto e cole o conteúdo de `supabase/001_init.sql` e após aplicar cole `supabase/002_add_auth_uid_and_rls.sql` na ordem.
	- Opção B — CLI / psql (quando você tiver a string de conexão):

PowerShell exemplo (substitua <CONN> pela connection string do Postgres):
```powershell
psql "<CONN>" -f .\supabase\001_init.sql
psql "<CONN>" -f .\supabase\002_add_auth_uid_and_rls.sql
```

	- Observação: a segunda migração habilita RLS nas tabelas e adiciona a coluna `auth_uid`. É necessário garantir que novas linhas tenham `auth_uid` preenchido — ou pelo cliente (nossa lib já adiciona `auth_uid` ao inserir) ou por um trigger no banco.

- 3) Variáveis de ambiente
	- Copie `.env.example` para `.env.local` (local) e preencha:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

	- Em produção / Vercel, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas Environment Variables do projeto.

Observação: este repositório inclui um workflow acionável (`Apply Vercel Env`) que permite que um admin aplique as variáveis via GitHub Actions (use o secret `VERCEL_TOKEN`). Veja `docs/ADMIN_SETUP.md` para instruções passo-a-passo.

Notas importantes:
- RLS: as policies em `002_add_auth_uid_and_rls.sql` verificam `auth_uid = auth.uid()` — clientes devem usar o Supabase Auth e a SDK para que o JWT seja enviado automaticamente nas requisições.
- Populando `auth_uid`: o cliente já inclui `auth_uid` ao criar registros (veja `src/services/supabase.ts`). Se preferir, crie um trigger DB que preencha `auth_uid` a partir das claims do JWT.

Exemplo básico (opcional) — preencher via trigger (AJUSTE conforme seu ambiente):
```sql
-- pseudo-exemplo: adapte conforme o formato das claims no seu Supabase
create function public.set_auth_uid() returns trigger language plpgsql as $$
begin
	if new.auth_uid is null then
		new.auth_uid := current_setting('request.jwt.claims', true);
	end if;
	return new;
end;
$$;

create trigger set_auth_uid_before_insert before insert on cards for each row execute procedure public.set_auth_uid();
```

Se quiser, eu aplico as alterações de docs e o `.env.example` em um PR, ou posso executar comandos locais de migração se você me der a connection string (use com cuidado). 

