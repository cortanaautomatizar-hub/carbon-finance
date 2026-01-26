param(
  [string]$jobUrl = 'https://github.com/cortanaautomatizar-hub/carbon-finance/actions/runs/21372608377/job/61520808935'
)

Write-Output "Fetching job page: $jobUrl"
try {
  $c = (Invoke-WebRequest -Uri $jobUrl -UseBasicParsing -TimeoutSec 30).Content
  $out = Join-Path $PSScriptRoot "tmp_job_61520808935.html"
  $c | Out-File -FilePath $out -Encoding utf8
  Write-Output "Wrote $out"
} catch {
  Write-Output "[ERROR] fetching job page: $_"
  exit 2
}

$patterns = @('Lint','error','ERROR','ERR','fail','FAIL','TypeError','ESLint','eslint','prettier','lint:')
foreach ($p in $patterns) {
  $m = Select-String -InputObject $c -Pattern $p -AllMatches
  if ($m) {
    Write-Output "--- Matches for '$p' ---"
    $m | ForEach-Object { Write-Output $_.Line }
  }
}

Write-Output "If logs are not visible in this page, downloading full run logs via the API (zip) may be necessary (requires auth for private repos)."