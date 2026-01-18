# Script: install-portable-node.ps1
# Extrai um ZIP do Node portátil para %USERPROFILE%\tools\node, ajusta PATH do usuário e verifica node/npm.
# Uso: execute no PowerShell do seu usuário (sem privilégios de administrador).

param(
  [string]$ZipPath = 'C:\Users\Alanderson.Barros\OneDrive - SODEXO\Documentos\node-v24.12.0-win-x64.zip',
  [string]$TargetDir = (Join-Path $env:USERPROFILE 'tools\node')
)

# 1) Criar pasta alvo
New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null

# 2) Extrair ZIP para uma pasta temporária
$tempExtract = Join-Path $env:TEMP ('node_portable_extract_' + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempExtract -Force | Out-Null
Expand-Archive -Path $ZipPath -DestinationPath $tempExtract -Force

# 3) Localizar pasta que contém node.exe
$found = Get-ChildItem -Path $tempExtract -Directory | Where-Object { Test-Path (Join-Path $_.FullName 'node.exe') } | Select-Object -First 1
if (-not $found) {
  if (Test-Path (Join-Path $tempExtract 'node.exe')) {
    $foundFolder = $tempExtract
  } else {
    Write-Error "Não foi possível localizar node.exe no ZIP. Verifique o arquivo: $ZipPath"
    Remove-Item -Recurse -Force $tempExtract
    exit 1
  }
} else {
  $foundFolder = $found.FullName
}

# 4) Copiar conteúdo para $TargetDir (substitui arquivos existentes)
Copy-Item -Path (Join-Path $foundFolder '*') -Destination $TargetDir -Recurse -Force

# 5) Remover extração temporária
Remove-Item -Recurse -Force $tempExtract

# 6) Verificar node.exe no alvo
if (-not (Test-Path (Join-Path $TargetDir 'node.exe'))) {
  Write-Error "node.exe não encontrado em $TargetDir após cópia."
  exit 1
}

# 7) Adicionar ao PATH da sessão atual (imediato)
$env:Path = "$TargetDir;$env:Path"

# 8) Adicionar ao PATH do usuário (persistente)
$userPath = [Environment]::GetEnvironmentVariable('PATH','User') ?? ''
if ($userPath -notlike "*$TargetDir*") {
  $newUserPath = if ($userPath) { "$TargetDir;$userPath" } else { "$TargetDir" }
  [Environment]::SetEnvironmentVariable('PATH', $newUserPath, 'User')
  Write-Output "Adicionado $TargetDir ao PATH de usuário. Novos terminais passarão a ver o Node após reabrir."
} else {
  Write-Output "Node já está no PATH de usuário."
}

# 9) Verificar instalação (session PATH)
Write-Output "Verificando node/npm (usando PATH da sessão atual):"
node -v
npm -v

Write-Output "Instalação finalizada. Se novos terminais não reconhecerem, reabra o PowerShell ou faça logoff/login."
