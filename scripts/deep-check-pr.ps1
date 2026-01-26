param(
  [int]$PrNumber = 6
)

$owner = "cortanaautomatizar-hub"
$repo = "carbon-finance"
# Add User-Agent header to avoid rejected requests by GitHub API
$hdr = @{ 'User-Agent' = 'meu-c6-finan-as-main-checker' }

Write-Output "Deep check for PR #$PrNumber (repo: $owner/$repo)"

try {
  $pr = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/pulls/$PrNumber" -Headers $hdr -UseBasicParsing -TimeoutSec 30
} catch {
  Write-Output "[ERROR] fetching PR #$PrNumber: $_"
  exit 2
}

$sha = $pr.head.sha
Write-Output "PR #$($pr.number) state: $($pr.state); head ref: $($pr.head.ref); head sha: $sha"

# Check runs
Write-Output "\n=== Check runs (commit) ==="
try {
  $checks = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/commits/$sha/check-runs" -Headers $hdr -UseBasicParsing -TimeoutSec 30
} catch {
  Write-Output "[ERROR] fetching check-runs: $_"
  $checks = $null
}

if ($checks -and $checks.check_runs) {
  foreach ($c in $checks.check_runs) {
    Write-Output ("- {0} | status={1} | conclusion={2} | url={3}" -f $c.name,$c.status,$c.conclusion,$c.html_url)
  }
} else {
  Write-Output "No check-runs data returned." 
}

# Combined status
Write-Output "\n=== Combined status ==="
try {
  $status = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/commits/$sha/status" -Headers $hdr -UseBasicParsing -TimeoutSec 30
} catch {
  Write-Output "[ERROR] fetching combined status: $_"
  $status = $null
}
if ($status) { Write-Output ("Combined state: {0} | total_count: {1}" -f $status.state,$status.total_count) } else { Write-Output "No combined status returned." }

# Workflow runs for this head sha
Write-Output "\n=== Workflow runs for head sha ==="
try {
  $wr = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/actions/runs?head_sha=$sha" -Headers $hdr -UseBasicParsing -TimeoutSec 30
} catch {
  Write-Output "[ERROR] fetching workflow runs: $_"
  $wr = $null
}

if ($wr -and $wr.workflow_runs) {
  foreach ($run in $wr.workflow_runs) {
    Write-Output ("- id={0} | name={1} | workflow_id={2} | status={3} | conclusion={4} | url={5}" -f $run.id,$run.name,$run.workflow_id,$run.status,$run.conclusion,$run.html_url)

    # get jobs for this run
    Write-Output ("  -> fetching jobs for run id $($run.id)")
    try {
      $jobs = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/actions/runs/$($run.id)/jobs" -Headers $hdr -UseBasicParsing -TimeoutSec 30
    } catch {
      Write-Output "  [ERROR] fetching jobs for run $($run.id): $_"
      continue
    }

    if ($jobs -and $jobs.jobs) {
      foreach ($job in $jobs.jobs) {
        Write-Output ("  job id={0} | name={1} | status={2} | conclusion={3} | html_url={4}" -f $job.id,$job.name,$job.status,$job.conclusion,$job.html_url)
        if ($job.steps) {
          foreach ($step in $job.steps) {
            Write-Output ("    step: {0} | status={1} | conclusion={2}" -f $step.name,$step.status,$step.conclusion)
          }
        }
      }
    }
  }
} else {
  Write-Output "No workflow runs found for this sha." 
}

# Summarize failures
Write-Output "\n=== Summary of failures (check-runs or jobs with conclusion failed) ==="
$failedChecks = @()
if ($checks -and $checks.check_runs) { $failedChecks = $checks.check_runs | Where-Object { $_.conclusion -eq 'failure' -or $_.conclusion -eq 'cancelled' } }
if ($failedChecks.Count -gt 0) {
  foreach ($f in $failedChecks) { Write-Output ("- Check failed: {0} | url={1}" -f $f.name, $f.html_url) }
}

$failedJobs = @()
if ($wr -and $wr.workflow_runs) {
  foreach ($run in $wr.workflow_runs) {
    try { $jobs = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/actions/runs/$($run.id)/jobs" -UseBasicParsing } catch { continue }
    $fj = $jobs.jobs | Where-Object { $_.conclusion -eq 'failure' -or $_.conclusion -eq 'cancelled' }
    if ($fj) { foreach ($job in $fj) { Write-Output ("- Job failed: run_id={0} job_id={1} name={2} | html={3}" -f $run.id,$job.id,$job.name,$job.html_url) } }
  }
}

Write-Output "\nIf any failures are present you can inspect the failing job URL in the GitHub UI to view step logs.\nTo re-run a failed workflow run (requires auth/gh or token):\n  - gh: gh run rerun <run-id>\n  - API: POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun (requires token with repo/workflow scope)\nFor stuck checks coming from external services (Vercel, Cypress, etc) re-run via their UI or API."
