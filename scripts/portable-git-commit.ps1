<#
portable-git-commit.ps1

Propósito:
- Permite fazer commit e push quando o Git não está instalado no sistema, usando um Git "portátil" baixado automaticamente.

Como usar (recomendado):
1. Defina o token GitHub (não cole no chat):
   $env:GITHUB_TOKEN = 'seu_pat_aqui'
2. Execute:
   .\scripts\portable-git-commit.ps1 -Repo 'owner/repo' -Branch 'main'

Notas de segurança:
- O script usa o token de ambiente para autenticar o push (forma segura localmente).
- Não exponha o token em logs ou no chat.

Requisitos:
- PowerShell 7+ (recomendado) ou Windows PowerShell (funciona também)
- Acesso de saída HTTP para baixar o Git portátil (se o administrador não permitir downloads, use a opção de subir via GitHub UI)

#>

param(
  [string]$Repo = 'cortanaautomatizar-hub/carbon-finance',
  [string]$Branch = 'main',
  [string[]]$Paths = @('.github/workflows/force-redeploy.yml','scripts/*'),
  [switch]$DryRun
)

function Throw-IfMissing([string]$msg) { Write-Error $msg; exit 1 }

if (-not (Get-Command Invoke-RestMethod -ErrorAction SilentlyContinue)) { Throw-IfMissing "Invoke-RestMethod não disponível neste ambiente." }

if (-not (Test-Path ".git")) {
  Write-Warning "A pasta atual parece não ser um repositório Git (não encontrei .git). Este script ainda aceita funcionar se você tiver permissões de push no repositório remoto, mas recomenda-se rodar na raiz do repositório local." 
}

if (-not $env:GITHUB_TOKEN) { Throw-IfMissing "Defina o token GitHub no ambiente: $env:GITHUB_TOKEN = 'SEU_PAT'" }

function Find-Git() {
  $git = (Get-Command git -ErrorAction SilentlyContinue)?.Source
  if ($git) { return $git }
  return $null
}

$gitExe = Find-Git
$cleanupTemp = $false
$tempDir = $null

if (-not $gitExe) {
  Write-Host "[*] Git não encontrado — vou baixar uma versão portátil (se permitido)"
  # Buscar release mais recente do Git for Windows e procurar asset 'Portable' (zip)
  $release = Invoke-RestMethod -Uri 'https://api.github.com/repos/git-for-windows/git/releases/latest' -UseBasicParsing
  $asset = $release.assets | Where-Object { $_.name -match 'PortableGit.*(64|x64).*zip' } | Select-Object -First 1
  if (-not $asset) { Write-Warning "Não encontrei asset Portable direto nas releases; tentando procurar qualquer asset com 'Portable'"; $asset = $release.assets | Where-Object { $_.name -match 'Portable' } | Select-Object -First 1 }
  if (-not $asset) { Throw-IfMissing "Não foi possível localizar um Git portátil na release mais recente. Alternativa: faça upload via GitHub UI." }

  $tempDir = Join-Path $env:TEMP ("portable_git_" + (Get-Random))
  New-Item -ItemType Directory -Path $tempDir | Out-Null
  $zipPath = Join-Path $tempDir $asset.name
  Write-Host "[*] Baixando: $($asset.browser_download_url) -> $zipPath"
  Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zipPath -UseBasicParsing

  Write-Host "[*] Extraindo..."
  try { Expand-Archive -LiteralPath $zipPath -DestinationPath $tempDir -Force } catch { Write-Host "Expand-Archive falhou, tentando 7z se disponível..."; & 7z x $zipPath -o$tempDir | Out-Null }

  # procurar git.exe
  $gitExe = Get-ChildItem -Path $tempDir -Filter git.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
  if (-not $gitExe) { Throw-IfMissing "git.exe não encontrado dentro do pacote portátil baixado." }

  $cleanupTemp = $true
  Write-Host "[*] Usando git portátil em: $gitExe"
}

# Função para executar git com captura de saída
function Run-Git([string[]]$args) {
  $exe = $gitExe
  $proc = & $exe @args 2>&1
  return @{ ExitCode = $LASTEXITCODE; Output = $proc -join "`n" }
}

# Configurar usuário (temporário)
$displayName = $env:GIT_COMMIT_NAME -or "actions-bot"
$displayEmail = $env:GIT_COMMIT_EMAIL -or "github-actions-bot@example.com"
Run-Git @('config','user.name',$displayName) | Out-Null
Run-Git @('config','user.email',$displayEmail) | Out-Null

Write-Host "[*] Adicionando arquivos: $($Paths -join ', ')"
if ($DryRun) { Write-Host "DryRun: não modificando."; if ($cleanupTemp) { Write-Host "Nota: git portátil baixado em $tempDir" }; exit 0 }

# Adicionar arquivos ao stage
foreach ($p in $Paths) {
  $res = Run-Git @('add',$p)
  if ($res.ExitCode -ne 0) { Write-Warning "git add retornou código $($res.ExitCode): $($res.Output)" }
}

# Commit (cria commit vazio se nada para adicionar)
$commitMsg = 'chore: add workflow/scripts to trigger redeploy'
$resStatus = Run-Git @('commit','-m',$commitMsg)
if ($resStatus.ExitCode -ne 0 -and $resStatus.Output -notmatch 'nothing to commit') {
  Write-Warning "commit falhou: $($resStatus.Output)"
} else { Write-Host "[*] Commit criado (ou sem alterações)." }

# Preparar URL remoto com token para push
$authUrl = "https://x-access-token:$($env:GITHUB_TOKEN)@github.com/$Repo.git"
# Certifique-se que origin existe; se não, adicionar
$originUrlRes = Run-Git @('remote','get-url','origin')
if ($originUrlRes.ExitCode -ne 0) {
  Write-Host "[*] Remote 'origin' não encontrado — adicionando origin -> https://github.com/$Repo.git"
  Run-Git @('remote','add','origin',"https://github.com/$Repo.git") | Out-Null
}

Write-Host "[*] Fazendo push para $Repo (branch: $Branch)"
# trocar origin temporariamente para incluir token
Run-Git @('remote','set-url','origin',$authUrl) | Out-Null
$push = Run-Git @('push','origin',$Branch)
if ($push.ExitCode -ne 0) { Throw-IfMissing "Push falhou: $($push.Output)" }
Write-Host "[OK] Push realizado com sucesso."

# Restaura origin para URL sem token
$originNoAuth = "https://github.com/$Repo.git"
Run-Git @('remote','set-url','origin',$originNoAuth) | Out-Null

if ($cleanupTemp -and $tempDir) {
  Write-Host "[*] Limpando $tempDir"
  Remove-Item -Recurse -Force -Path $tempDir
}

Write-Host "[*] Feito."