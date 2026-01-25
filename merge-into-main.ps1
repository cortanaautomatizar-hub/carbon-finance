param(
  [string]$sourceBranch = 'ci/supabase-key-check',
  [string]$targetBranch = 'main'
)

$ErrorActionPreference = 'Stop'

Write-Host "Iniciando unificacao: $sourceBranch -> $targetBranch" -ForegroundColor Cyan

# 1. Atualizar o que vem do GitHub
& git fetch origin

# 2. Mudar para a branch principal
& git checkout $targetBranch

# 3. Puxar as ultimas novidades da main
& git pull origin $targetBranch

# 4. Trazer as correcoes da branch de teste
Write-Host "Mesclando alteracoes..." -ForegroundColor Yellow
& git merge --no-ff --no-edit "origin/$sourceBranch"

# 5. Enviar para a Vercel
Write-Host "Enviando para o servidor (Vercel)..." -ForegroundColor Green
& git push origin $targetBranch

Write-Host "`n✅ Sucesso! Verifique seu site na Vercel em alguns instantes." -ForegroundColor Green