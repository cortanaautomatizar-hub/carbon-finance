<#
Script único para Windows: aplica variáveis no Vercel, dispara deploy e executa diagnóstico Playwright.
Uso:
  powershell -ExecutionPolicy Bypass -File .\scripts\run-all-windows.ps1 -Org cortanas-projects-66cf4d9c -Project carbon-finance

Fluxo:
  1) Solicita token VERCEL (ou usa $env:VERCEL_TOKEN)
  2) Executa apply-vercel-env.ps1 com -TriggerDeploy
  3) Solicita a URL pública do deploy (copie/cole do botão "Visit" do Vercel)
  4) Executa diagnóstico: npm run diag:vercel -- <url>
  5) Abre o arquivo de relatório em Notepad

Segurança: não cole o token em chats; use o prompt seguro do script.
#>
param(
  [Parameter(Mandatory=$true)] [string] $Org,
  [Parameter(Mandatory=$true)] [string] $Project
)

function Read-SecureStringAsPlainText($prompt) {
  $secure = Read-Host -Prompt $prompt -AsSecureString
  $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
  [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  return $plain
}

# Token
if (-not $env:VERCEL_TOKEN) {
  $token = Read-SecureStringAsPlainText 'Cole seu token VERCEL (AD7fHk3IRcAOkG1q2cZ6XgCn)'
  if (-not $token) { Write-Error 'Token VERCEL é obrigatório'; exit 1 }
  $env:VERCEL_TOKEN = $token
  $tokenSetHere = $true
} else {
  Write-Output 'Usando VERCEL_TOKEN já definido na sessão.'
  $tokenSetHere = $false
}

# Run apply script (assumes file present)
Write-Output 'Executando apply-vercel-env.ps1...'
$applyCmd = 'powershell -ExecutionPolicy Bypass -File .\scripts\apply-vercel-env.ps1 -Org ' + $Org + ' -Project ' + $Project + ' -TriggerDeploy'
Write-Output $applyCmd
$applyProc = Start-Process -FilePath 'powershell' -ArgumentList '-ExecutionPolicy','Bypass','-File','.\scripts\apply-vercel-env.ps1','-Org',$Org,'-Project',$Project,'-TriggerDeploy' -NoNewWindow -Wait -PassThru
if ($applyProc.ExitCode -ne 0) {
  Write-Error 'apply-vercel-env.ps1 retornou erro. Verifique a saída acima.'
  if ($tokenSetHere) { Remove-Item Env:\VERCEL_TOKEN }
  exit 1
}
Write-Output 'apply-vercel-env.ps1 concluído.'

# Ask for public URL
$publicUrl = Read-Host -Prompt 'Cole a URL pública do deploy (Visitar -> Copy URL do Vercel)'
if (-not $publicUrl) { Write-Error 'URL pública é necessária para o diagnóstico'; if ($tokenSetHere) { Remove-Item Env:\VERCEL_TOKEN }; exit 1 }

# Run diagnostic
Write-Output "Executando diagnóstico contra $publicUrl"
# Use npm.cmd to avoid PowerShell script execution restrictions
$diagCmd = "npm.cmd run diag:vercel -- $publicUrl"
Write-Output $diagCmd
$diagProc = Start-Process -FilePath 'cmd' -ArgumentList '/c',$diagCmd -NoNewWindow -Wait -PassThru
if ($diagProc.ExitCode -ne 0) {
  Write-Warning 'Diagnóstico retornou código de erro. Verifique logs.'
}

# Show report
$report = Join-Path (Get-Location) 'scripts\diag-vercel-report.json'
if (Test-Path $report) {
  Write-Output "Relatório salvo em: $report"
  Start-Process notepad $report
} else {
  Write-Warning 'Relatório não encontrado.'
}

# Cleanup
if ($tokenSetHere) { Remove-Item Env:\VERCEL_TOKEN }
Write-Output 'Fluxo finalizado.'
