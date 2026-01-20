<#
Script: setup-git-and-push.ps1
Propósito: detectar Git Portable em %USERPROFILE%\tools\git, atualizar PATH da sessão e do usuário,
e executar os comandos git para criar branch, commitar arquivos seguros e dar push.

Uso (PowerShell, sem admin):
powershell -ExecutionPolicy Bypass -File .\scripts\setup-git-and-push.ps1

O script pedirá confirmação antes de executar o commit/push.
#>

param(
  [string]$Branch = 'feat/supabase-setup',
  [string]$BaseCommit = 'f5efe5f',
  [string[]]$FilesToAdd = @(
    'src/services/supabase.ts',
    '.env.example',
    'DEPLOY.md',
    'supabase/002_add_auth_uid_and_rls.sql',
    'docs/GIT_PORTABLE_INSTALL.md'
  )
)

function Ensure-GitInPath {
  Write-Output "Procurando Git em: $env:USERPROFILE\tools\git ..."
  $found = Get-ChildItem -Path (Join-Path $env:USERPROFILE 'tools\git') -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -in 'git.exe','git.cmd' } | Select-Object -First 1
  if (-not $found) {
    Write-Error "Git não encontrado em $env:USERPROFILE\tools\git. Extraia o PortableGit e tente novamente."
    return $false
  }
  $gitCmdDir = $found.DirectoryName
  Write-Output "Encontrado Git em: $gitCmdDir"

  # atualizar PATH da sessão
  if ($env:Path -notlike "*$gitCmdDir*") {
    $env:Path = "$gitCmdDir;$env:Path"
    Write-Output "Atualizado PATH da sessão para incluir: $gitCmdDir"
  }

  # atualizar PATH do usuário (persistente)
  $userPath = [Environment]::GetEnvironmentVariable('Path','User')
  if (-not $userPath) { $userPath = '' }
  if ($userPath -notlike "*$gitCmdDir*") {
    $newUserPath = if ($userPath) { "$gitCmdDir;$userPath" } else { $gitCmdDir }
    [Environment]::SetEnvironmentVariable('Path', $newUserPath, 'User')
    Write-Output "Adicionado $gitCmdDir ao PATH de usuário (persistente)." 
  }
  return $true
}

function Run-GitCommand {
  param([string]$Cmd)
  Write-Output "> $Cmd"
  $output = & cmd /c $Cmd 2>&1
  $exit = $LASTEXITCODE
  Write-Output $output
  return $exit
}

if (-not (Ensure-GitInPath)) { exit 1 }

# checar versão
try {
  git --version
} catch {
  Write-Error "Falha ao executar git --version."
  exit 1
}

# verificar repositório
$isRepo = (git rev-parse --is-inside-work-tree 2>$null) -eq 'true'
if (-not $isRepo) {
  Write-Error "O diretório atual não parece ser um repositório git. Execute na raiz do projeto e tente novamente."
  exit 1
}

Write-Output "Preparando para criar branch '$Branch' a partir de '$BaseCommit' e commitar arquivos:"
$FilesToAdd | ForEach-Object { Write-Output " - $_" }

$confirm = Read-Host "Continuar e executar git add/commit/push? (y/N)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
  Write-Output "Operação cancelada pelo usuário."
  exit 0
}

# fetch e criar/checkout branch
if (Run-GitCommand "git fetch origin" -ne 0) { Write-Error "git fetch falhou."; exit 1 }

# se a branch já existe remotamente, apenas faça checkout
$remoteBranches = git ls-remote --heads origin $Branch
if ($remoteBranches) {
  if (Run-GitCommand "git checkout $Branch" -ne 0) { Write-Error "git checkout $Branch falhou."; exit 1 }
} else {
  if (Run-GitCommand "git checkout -b $Branch $BaseCommit" -ne 0) { Write-Error "git checkout -b $Branch falhou."; exit 1 }
}

# adicionar arquivos existentes
$toAdd = @()
foreach ($f in $FilesToAdd) {
  if (Test-Path $f) { $toAdd += $f } else { Write-Output "Ignorando arquivo ausente: $f" }
}
if ($toAdd.Count -eq 0) { Write-Output "Nenhum arquivo existente para adicionar. Saindo."; exit 0 }

if (Run-GitCommand "git add $($toAdd -join ' ')" -ne 0) { Write-Error "git add falhou."; exit 1 }

# verificar se há mudanças staged
$status = git status --porcelain
if (-not $status) {
  Write-Output "Nenhuma mudança para commitar. Verifique o status do git.";
  exit 0
}

if (Run-GitCommand 'git commit -m "chore(supabase): add RLS trigger, update client and docs; add Git Portable install guide"' -ne 0) { Write-Error "git commit falhou."; exit 1 }

if (Run-GitCommand "git push -u origin $Branch" -ne 0) { Write-Error "git push falhou. Verifique autenticação e remotes."; exit 1 }

Write-Output "Push concluído. Abra o GitHub e crie o PR a partir de '$Branch'."
