param(
  [int]$PrNumber = 0
)

$owner = "cortanaautomatizar-hub"
$repo = "carbon-finance"
$branch = "feat/balancecard-redesign"
$logFile = Join-Path $PSScriptRoot "watch-pr-balancecard.log"

if ($PrNumber -gt 0) {
  Write-Output "[INFO] Starting PR watcher for explicit PR #$PrNumber" | Tee-Object -FilePath $logFile -Append
  $prNumber = $PrNumber
  $prUrl = "https://github.com/$owner/$repo/pull/$prNumber"
} else {
  Write-Output "[INFO] Starting PR watcher for branch '$branch'" | Tee-Object -FilePath $logFile -Append

  $foundPr = $null
  while (-not $foundPr) {
      try {
          $pulls = Invoke-RestMethod "https://api.github.com/repos/$owner/$repo/pulls?state=open" -UseBasicParsing
      } catch {
          $err = "[ERROR] fetching pulls: $_"
          Write-Output $err | Tee-Object -FilePath $logFile -Append
          Start-Sleep -Seconds 15
          continue
      }

      $foundPr = $pulls | Where-Object { $_.head.ref -eq $branch }
      if ($foundPr) {
          $prNumber = $foundPr.number
          $prUrl = $foundPr.html_url
          $msg = "[FOUND] PR detected: $prUrl"
          Write-Output $msg | Tee-Object -FilePath $logFile -Append
          break
      }

      Start-Sleep -Seconds 10
  }
}

$prev = ""
Write-Output "[INFO] Starting checks monitor for PR #$prNumber" | Tee-Object -FilePath $logFile -Append
while ($true) {
    try {
        $c = (Invoke-WebRequest $prUrl -UseBasicParsing).Content
    } catch {
        $err = "[ERROR] fetching PR page: $_"
        Write-Output $err | Tee-Object -FilePath $logFile -Append
        Start-Sleep -Seconds 60
        continue
    }

    # Try to extract checks status (e.g. "2 / 2 checks OK") or fallback to a generic 'Checks x' indicator
    $m = [regex]::Match($c, '([0-9]+\s*/\s*[0-9]+\s*checks\s*(OK|Passed|passed|Failed|failed|success|failure))', 'IgnoreCase')
    if ($m.Success) { $status = $m.Value } else { $m2 = [regex]::Match($c,'Checks\s*\d+', 'IgnoreCase'); if ($m2.Success) { $status = $m2.Value } else { $status = 'unknown' } }

    if ($status -ne $prev) {
        $prev = $status
        $t = (Get-Date).ToString()
        $out = "[$t] PR #$prNumber status changed: $status"
        Write-Output $out | Tee-Object -FilePath $logFile -Append

        # If checks completed as OK/Passed or Failed, send a desktop notification as well
        if ($out -match '(OK|Passed|passed|success)') {
            Write-Output "[ALERT] PR #$prNumber checks passed: $status" | Tee-Object -FilePath $logFile -Append
            # Windows toast notification
            [void] [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms")
            [System.Windows.Forms.MessageBox]::Show("PR #$prNumber checks passed: $status", "PR Checks")
        } elseif ($out -match '(Failed|failed|failure)') {
            Write-Output "[ALERT] PR #$prNumber checks failed: $status" | Tee-Object -FilePath $logFile -Append
            [void] [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms")
            [System.Windows.Forms.MessageBox]::Show("PR #$prNumber checks failed: $status", "PR Checks")
        }
    }

    Start-Sleep -Seconds 60
}