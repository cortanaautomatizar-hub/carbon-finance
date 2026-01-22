<#
Update-Vercel-Env.ps1

Uso:
  .\update-vercel-env.ps1 -ProjectId <PROJECT_ID> -VercelToken $env:VERCEL_TOKEN -SupabaseUrl <url> -SupabaseAnonKey <key>

Requisitos:
 - PowerShell 7+ (recomendada)
 - Um token Vercel em VERCEL_TOKEN (ou passe via -VercelToken)
 - ID do projeto (`ProjectId`) — veja no Dashboard Vercel (Project Settings)

Observação: o script remove variáveis existentes com o mesmo nome e cria novas com os valores fornecidos. Ele não dispara o redeploy automaticamente — você pode redeployar via Dashboard ou forçar um commit vazio.
#>

param(
  [string]$VercelToken = $env:VERCEL_TOKEN,
  [string]$ProjectId,
  [string]$SupabaseUrl,
  [string]$SupabaseAnonKey
)

function Throw-IfMissing([string]$msg) { Write-Error $msg; exit 1 }

if (-not $VercelToken) { Throw-IfMissing "Vercel token não fornecido. Defina VERCEL_TOKEN ou passe -VercelToken." }
if (-not $ProjectId) { Throw-IfMissing "ProjectId (ID do projeto Vercel) é obrigatório." }
if (-not $SupabaseUrl -or -not $SupabaseAnonKey) { Throw-IfMissing "Supabase URL e ANON key são obrigatórios." }

$base = "https://api.vercel.com"
$headers = @{ Authorization = "Bearer $VercelToken"; "Content-Type" = "application/json" }

Write-Host "[*] Listando variáveis existentes..."
$envs = Invoke-RestMethod -Uri "$base/v9/projects/$ProjectId/env" -Headers $headers -Method GET

$keysToUpdate = @{
  "VITE_SUPABASE_URL" = $SupabaseUrl
  "VITE_SUPABASE_ANON_KEY" = $SupabaseAnonKey
}

foreach ($k in $keysToUpdate.Keys) {
  $existing = $envs.envs | Where-Object { $_.key -eq $k }
  if ($existing) {
    foreach ($e in $existing) {
      Write-Host "[*] Removendo variável existente: $($e.key) (id: $($e.uid))"
      Invoke-RestMethod -Uri "$base/v9/projects/$ProjectId/env/$($e.uid)" -Headers $headers -Method DELETE
    }
  }

  $body = @{
    key = $k
    value = $keysToUpdate[$k]
    target = @("production","preview")
    type = "encrypted"
  } | ConvertTo-Json -Depth 5

  Write-Host "[*] Criando variável: $k"
  $res = Invoke-RestMethod -Uri "$base/v9/projects/$ProjectId/env" -Headers $headers -Method POST -Body $body
  if (-not $res) { Write-Warning "Falha ao criar variável $k" }
}

Write-Host "[OK] Variáveis atualizadas. Agora force um redeploy no Vercel (Dashboard → Redeploy) ou faça um commit vazio e push: git commit --allow-empty -m 'chore: trigger redeploy after env update'; git push"