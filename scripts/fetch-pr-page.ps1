param(
  [int]$PrNumber = 6
)

$url = "https://github.com/cortanaautomatizar-hub/carbon-finance/pull/$PrNumber"
Write-Output "Fetching PR page: $url"
try {
  $c = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30).Content
  $out = Join-Path $PSScriptRoot ("tmp_pr$PrNumber.html")
  $c | Out-File -FilePath $out -Encoding utf8
  Write-Output "Wrote $out"
} catch {
  Write-Output "[ERROR] fetching PR page: $_"
  exit 2
}

$patterns = @('checks','Failed','failed','failure','Failure','OK','Passed','Checks','conclusion','check-run')
foreach ($p in $patterns) {
  $m = Select-String -InputObject $c -Pattern $p -AllMatches
  if ($m) {
    Write-Output "--- Matches for '$p' ---"
    $m | ForEach-Object { Write-Output $_.Line }
  }
}

Write-Output "\nYou can open the written HTML file to inspect the checks panel visually: $out"