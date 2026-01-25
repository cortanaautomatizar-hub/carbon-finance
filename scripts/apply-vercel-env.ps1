<#
Script para aplicar variáveis de ambiente no Vercel
Uso:
  - Opcionalmente salve seus valores em um arquivo `.env.vercel` na raiz do projeto:
      VITE_SUPABASE_URL=https://xyz.supabase.co
      VITE_SUPABASE_ANON_KEY=pk_XXXX

  - Execute interativamente (recomendado):
      powershell -ExecutionPolicy Bypass -File .\scripts\apply-vercel-env.ps1 -Org cortanas-projects-66cf4d9c -Project carbon-finance

  - O script solicitará seu token VERCEL (mantido apenas em memória) e os valores faltantes.
  - Para acionar um deploy de produção ao final, adicione o switch `-TriggerDeploy` (executa `npx vercel --prod --confirm`).

Segurança: NÃO cole seu token em chats. Execute este script localmente e cole o token apenas no prompt seguro.
#>
param(
  [Parameter(Mandatory=$true)] [string] $Org,
  [Parameter(Mandatory=$true)] [string] $Project,
  [string] $ProjectId,
  [switch] $TriggerDeploy
)

# If ProjectId is provided, use it directly (useful when lookups fail)
if ($ProjectId) {
  Write-Output "Usando ProjectId fornecido: $ProjectId"
  $projectId = $ProjectId
}

function Read-SecureStringAsPlainText($prompt) {
  $secure = Read-Host -Prompt $prompt -AsSecureString
  $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
  [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  return $plain
}

# Read .env.vercel if present
$envFile = Join-Path (Get-Location) '.env.vercel'
$envVals = @{}
if (Test-Path $envFile) {
  Write-Output "Encontrado $envFile - lendo valores"
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^(\w+)=(.*)$') {
      $envVals[$matches[1]] = $matches[2]
    }
  }
}

# Ask for token
# Prefer using the VERCEL_TOKEN environment variable locally to avoid typing/pasting in chat.
if ($env:VERCEL_TOKEN) {
  $vercelToken = $env:VERCEL_TOKEN
  Write-Output 'Usando VERCEL_TOKEN do ambiente local (não será exibido).'
  # Remover da variável de ambiente da sessão por segurança
  Remove-Item Env:\VERCEL_TOKEN -ErrorAction SilentlyContinue
} else {
  $vercelToken = Read-SecureStringAsPlainText 'Paste your VERCEL token (will not be stored)'
}
if (-not $vercelToken) { Write-Error 'Token VERCEL é obrigatório'; exit 1 }
$headers = @{ Authorization = "Bearer $vercelToken"; 'Content-Type' = 'application/json' }

# Get project to obtain id
$projectUri = "https://api.vercel.com/v9/projects/$Org/$Project"
try {
  $projectResp = Invoke-RestMethod -Method Get -Uri $projectUri -Headers $headers -ErrorAction Stop
  $projectId = $projectResp.id
  Write-Output "ID do projeto: $projectId"
} catch {
  Write-Warning "Falha ao buscar projeto usando 'Org/Project': $_.Exception.Message"
  Write-Output "Tentando localizar projeto pelo nome entre projetos acessíveis..."

  # 1) procurar nos projetos do usuário
  try {
    $allProjects = Invoke-RestMethod -Method Get -Uri "https://api.vercel.com/v1/projects" -Headers $headers -ErrorAction Stop
    $found = $allProjects | Where-Object { $_.name -eq $Project }
    if ($found) {
      $projectId = $found[0].id
      Write-Output "Projeto encontrado nos projetos do usuário: $($found[0].name) (id: $projectId)"
    }
  } catch {
    Write-Verbose "Não foi possível listar projetos do usuário: $_"
  }

  # 2) procurar em equipes acessíveis
  if (-not $projectId) {
    try {
      $teams = Invoke-RestMethod -Method Get -Uri 'https://api.vercel.com/v1/teams' -Headers $headers -ErrorAction Stop
      foreach ($t in $teams) {
        try {
          $teamProjects = Invoke-RestMethod -Method Get -Uri "https://api.vercel.com/v1/projects?teamId=$($t.id)" -Headers $headers -ErrorAction Stop
          $fp = $teamProjects | Where-Object { $_.name -eq $Project }
          if ($fp) {
            $projectId = $fp[0].id
            Write-Output "Projeto encontrado na equipe '$($t.name)' (slug: $($t.slug)) com id: $projectId"
            break
          }
        } catch {
          Write-Verbose "Não foi possível listar projetos para a equipe $($t.name): $_"
        }
      }
    } catch {
      Write-Verbose "Não foi possível listar equipes: $_"
    }
  }

  if (-not $projectId) {
    Write-Error "Não foi possível localizar o projeto '$Project'. Verifique os valores de -Org e -Project e o escopo do token (acesso ao time)."
    exit 1
  }
}

# Fetch existing envs
$envsUri = "https://api.vercel.com/v9/projects/$projectId/env"
$existing = Invoke-RestMethod -Method Get -Uri $envsUri -Headers $headers
$existingMap = @{}
foreach ($e in $existing) { $existingMap[$e.key] = $e }

function Add-Or-ReplaceEnv($key, $value) {
  if ($existingMap.ContainsKey($key)) {
    $eid = $existingMap[$key].id
    Write-Output "Removendo variável existente $key (id: $eid)"
    Invoke-RestMethod -Method Delete -Uri "https://api.vercel.com/v9/projects/$projectId/env/$eid" -Headers $headers | Out-Null
  }
  $body = @{ key = $key; value = $value; target = @('preview','production'); type = 'encrypted' } | ConvertTo-Json
  Write-Output "Adicionando variável $key..."
  Invoke-RestMethod -Method Post -Uri $envsUri -Headers $headers -Body $body -ErrorAction Stop
  Write-Output "Variável $key adicionada"
}

# Keys to set
$keys = @('VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY')
foreach ($k in $keys) {
  $val = $null
  if ($envVals.ContainsKey($k)) { $val = $envVals[$k] }
  if (-not $val) {
    $val = Read-Host -Prompt "Enter value for $k"
  }
  if (-not $val) { Write-Error "$k is required"; exit 1 }
  Add-Or-ReplaceEnv -key $k -value $val
}

Write-Output "Todas as variáveis foram definidas para o projeto $Org/$Project."
if ($TriggerDeploy) {
  Write-Output "Acionando deploy de produção via Vercel CLI..."
  $deployCmd = 'npx vercel --prod --confirm'
  $proc = Start-Process -FilePath 'npx' -ArgumentList 'vercel','--prod','--confirm' -NoNewWindow -Wait -PassThru
  if ($proc.ExitCode -eq 0) { Write-Output 'Deploy de produção acionado com sucesso.' } else { Write-Warning 'O comando de deploy retornou código de erro.' }
}

Write-Output "Concluído. Verifique o painel do Vercel para o status do deploy e das variáveis."