<#
Reset-Supabase.ps1

Uso:
  # Fazer backup (opcional) e resetar schema + aplicar migrações
  .\reset-supabase.ps1 -DbConn "postgresql://user:pass@host:5432/dbname" -Backup

Requisitos:
 - psql (cliente do Postgres) disponível no PATH
 - opcionalmente pg_dump para backup
 - Rodar a partir do diretório do projeto (script usa caminho relativo para pasta `supabase/`)
#>

param(
  [string]$DbConn = $env:PG_CONN,
  [string]$SqlFolder = (Resolve-Path -Path "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\..\supabase").Path,
  [switch]$Backup
)

function Throw-IfMissing([string]$msg) { Write-Error $msg; exit 1 }

if (-not $DbConn) { Throw-IfMissing "Connection string não fornecida. Use -DbConn ou defina env PG_CONN." }

Write-Host "[*] Usando connection string: $($DbConn -replace ":.*@","****@")"
Write-Host "[*] Pasta SQL: $SqlFolder"

# Backup (opcional)
if ($Backup) {
  $pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
  if (-not $pgDump) { Write-Warning "pg_dump não encontrado no PATH; pulando backup." }
  else {
    $backupsDir = Join-Path -Path (Split-Path -Parent $MyInvocation.MyCommand.Path) -ChildPath "backups"
    if (-not (Test-Path $backupsDir)) { New-Item -ItemType Directory -Path $backupsDir | Out-Null }
    $file = Join-Path -Path $backupsDir -ChildPath ("backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sqlc")
    Write-Host "[*] Efetuando backup para: $file"
    & pg_dump --format=custom --file=$file $DbConn
    if ($LASTEXITCODE -ne 0) { Throw-IfMissing "pg_dump falhou (exit $LASTEXITCODE)." }
    Write-Host "[OK] Backup finalizado."
  }
}

# Checar psql
$psql = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psql) { Throw-IfMissing "psql não encontrado no PATH. Instale o cliente PostgreSQL e tente novamente." }

# Reset schema
Write-Host "[*] Resetando schema public (DROP SCHEMA public CASCADE; CREATE SCHEMA public;)"
$resetCmd = "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
& psql $DbConn -c $resetCmd
if ($LASTEXITCODE -ne 0) { Throw-IfMissing "psql falhou ao resetar o schema (exit $LASTEXITCODE)." }
Write-Host "[OK] Schema resetado."

# Aplicar migrações (executar .sql em ordem)
$sqlFiles = @("001_init.sql", "002_add_auth_uid_and_rls.sql") | ForEach-Object { Join-Path -Path $SqlFolder -ChildPath $_ }
foreach ($f in $sqlFiles) {
  if (-not (Test-Path $f)) { Throw-IfMissing "Arquivo SQL não encontrado: $f" }
  Write-Host "[*] Aplicando $f"
  & psql $DbConn -f $f
  if ($LASTEXITCODE -ne 0) { Throw-IfMissing "psql falhou ao aplicar $f (exit $LASTEXITCODE)." }
}

Write-Host "[OK] Migrações aplicadas com sucesso."

Write-Host "\nPróximo passo: atualize as variáveis de ambiente no Vercel (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) e force um redeploy (git commit --allow-empty -m 'chore: redeploy after supabase reset'; git push) ou clique em Redeploy no Dashboard."