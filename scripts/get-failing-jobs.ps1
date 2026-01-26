param(
  [long[]]$runIds = @(21372608377,21372342606)
)

$hdr = @{ 'User-Agent' = 'meu-c6-checker' }
$owner = 'cortanaautomatizar-hub'
$repo = 'carbon-finance'

foreach ($rid in $runIds) {
  Write-Output "\n=== Run $rid jobs ==="
  try {
    $jobs = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/actions/runs/$rid/jobs" -Headers $hdr -UseBasicParsing -TimeoutSec 20
  } catch {
    Write-Output ("[ERROR] fetching jobs for run {0}: {1}" -f $rid, $_.Exception.Message)
    continue
  }

  if ($jobs -and $jobs.jobs) {
    foreach ($job in $jobs.jobs) {
      Write-Output ("job id={0} | name={1} | status={2} | conclusion={3} | html={4}" -f $job.id,$job.name,$job.status,$job.conclusion,$job.html_url)
      if ($job.steps) {
        foreach ($step in $job.steps) {
          if ($step.conclusion -eq 'failure' -or $step.conclusion -eq 'cancelled') {
            Write-Output ("  FAILED STEP: job={0} | step_number={1} | step_name={2} | conclusion={3}" -f $job.name,$step.number,$step.name,$step.conclusion)
          }
        }
      }
    }
  } else {
    Write-Output "No jobs returned for run $rid." 
  }
}
