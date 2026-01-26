$owner = 'cortanaautomatizar-hub'
$repo = 'carbon-finance'
$pr = 6
$hdr = @{ 'User-Agent' = 'meu-c6-checker' }

try {
  Write-Output "Requesting PR #$pr..."
  $prJson = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/pulls/$pr" -Headers $hdr -UseBasicParsing -TimeoutSec 15
  Write-Output "PR head ref: $($prJson.head.ref), sha: $($prJson.head.sha)"
} catch {
  Write-Output "[ERROR] Could not fetch PR JSON: $_"
  exit 2
}

$sha = $prJson.head.sha
try {
  Write-Output "Requesting check-runs for commit $sha..."
  $checks = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/commits/$sha/check-runs" -Headers $hdr -UseBasicParsing -TimeoutSec 15
  if ($checks -and $checks.check_runs) {
    foreach ($c in $checks.check_runs) {
      Write-Output ("- {0} | status={1} | conclusion={2} | url={3}" -f $c.name,$c.status,$c.conclusion,$c.html_url)
    }
  } else { Write-Output "No check-runs returned or none present." }
} catch { Write-Output "[ERROR] fetching check-runs: $_" }

try {
  Write-Output "Requesting workflow runs for head sha $sha..."
  $wr = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/actions/runs?head_sha=$sha" -Headers $hdr -UseBasicParsing -TimeoutSec 15
  if ($wr -and $wr.workflow_runs) {
    foreach ($run in $wr.workflow_runs) {
      Write-Output ("- run id={0} | name={1} | status={2} | conclusion={3} | url={4}" -f $run.id,$run.name,$run.status,$run.conclusion,$run.html_url)
    }
  } else { Write-Output "No workflow runs found for this sha." }
} catch { Write-Output "[ERROR] fetching workflow runs: $_" }
