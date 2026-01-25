# Git Portable — instalação e uso (sem admin)

Este guia mostra como instalar o Git Portable no Windows sem privilégios de administrador e como usar os comandos git para criar branch, commitar e dar push.

Passo 1 — Baixar o Git Portable

- Acesse: https://github.com/git-for-windows/git/releases
- Baixe o arquivo marcado como **PortableGit-*-64-bit.7z.exe** ou a versão ZIP mais recente.

Passo 2 — Extrair para a pasta do usuário

- Recomendo extrair para `%USERPROFILE%\\tools\\git`.
- Se baixou `.7z.exe`, execute-o e extraia para a pasta acima. Se baixou `.zip`, use o PowerShell:

```powershell
Expand-Archive -Path 'C:\\Users\\<seu_usuario>\\Downloads\\PortableGit.zip' -DestinationPath "$env:USERPROFILE\\tools\\git" -Force
```

Passo 3 — Adicionar o Git ao PATH (sessão e persistente)

Abra o PowerShell (como usuário normal) e execute:

```powershell
$gitCmdDir = Join-Path $env:USERPROFILE 'tools\\git\\cmd'
# sessão atual
$env:Path = "$gitCmdDir;$env:Path"

# persistente (User PATH)
$userPath = [Environment]::GetEnvironmentVariable('Path','User')
if (-not $userPath) { $userPath = '' }
if ($userPath -notlike "*$gitCmdDir*") {
  $newUserPath = if ($userPath) { "$gitCmdDir;$userPath" } else { $gitCmdDir }
  [Environment]::SetEnvironmentVariable('Path', $newUserPath, 'User')
  Write-Output "Adicionado $gitCmdDir ao PATH de usuário. Reabra o terminal."
} else {
  Write-Output "Path do Git já presente."
}

# depois, abra um novo terminal e verifique:
git --version
```

Passo 4 — Comandos Git prontos (criar branch, commitar e push)

Use estes comandos na raiz do repositório:

```bash
git fetch origin
git checkout -b feat/supabase-setup f5efe5f

# adicionar apenas os arquivos seguros
git add src/services/supabase.ts .env.example DEPLOY.md supabase/002_add_auth_uid_and_rls.sql

git commit -m "chore(supabase): add RLS trigger, update client and docs"
git push -u origin feat/supabase-setup
```

Passo 5 — Abrir Pull Request (web)

- Vá ao repositório no GitHub → haverá um botão “Compare & pull request” para a nova branch. Use o título e corpo do PR gerados pelo time.

Boas práticas
- Nunca comite `.env.local` ou secrets. Mantenha `.env.example` com placeholders.
- Se uma service-role key foi exposta, rotacione-a no painel Supabase.
- Use Vercel Environment Variables para `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

Se quiser, eu posso gerar o patch (arquivo + comandos) e preparar o texto do PR automaticamente — para abrir o PR eu precisarei de um PAT com escopo `repo`.
