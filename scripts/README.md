# Scripts de suporte

Contém utilitários para resetar o banco Supabase e atualizar variáveis no Vercel.

## reset-supabase.ps1
- Uso: `.\reset-supabase.ps1 -DbConn "postgresql://user:pass@host:5432/db" -Backup`
- O script faz (opcional) backup com `pg_dump`, reseta o schema (`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`) e aplica as migrações em `supabase/001_init.sql` e `supabase/002_add_auth_uid_and_rls.sql`.
- Requisitos: `psql` (obrigatório), `pg_dump` (opcional para backup).

## update-vercel-env.ps1
- Uso: `.\update-vercel-env.ps1 -ProjectId <PROJECT_ID> -VercelToken $env:VERCEL_TOKEN -SupabaseUrl <url> -SupabaseAnonKey <key>`
- O script usa a API do Vercel para remover e recriar duas variáveis: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nos targets `production` e `preview`.
- Requisitos: `VERCEL_TOKEN` com permissões de escrita no projeto Vercel.

## portable-git-commit.ps1
- Uso: defina `$env:GITHUB_TOKEN` com um Personal Access Token **(scope repo or workflow)** e rode:
  `.\portable-git-commit.ps1 -Repo 'owner/repo' -Branch 'main'`
- O script baixa uma versão portátil do Git (se não houver `git` no PATH), adiciona/commita os arquivos relevantes (`.github/workflows/force-redeploy.yml` e `scripts/*`) e faz `git push` usando o token para autenticação.
- Observações de segurança: o token é lido apenas do ambiente e não é logado; remova o token do shell após o uso.

---

Sempre verifique os backups antes de excluir dados em produção. Se quiser, posso também adicionar um job GitHub Action que executa essas etapas (com secrets) após confirmação.
