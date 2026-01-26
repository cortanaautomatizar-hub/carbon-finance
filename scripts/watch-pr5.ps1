$prUrl = 'https://github.com/cortanaautomatizar-hub/carbon-finance/pull/5'
$prev = ''
while ($true) {
  try {
    $resp = Invoke-WebRequest -Uri $prUrl -UseBasicParsing -ErrorAction Stop
    $c = $resp.Content
  } catch {
    Write-Output "[ERROR] fetching PR: $_"
    Start-Sleep -Seconds 60
    continue
  }
  $m = [regex]::Match($c, '([0-9]+\s*/\s*[0-9]+\s*checks\s*(OK|Passed|passed|Failed|failed|success|failure))', 'IgnoreCase')
  if ($m.Success) { $status = $m.Value.Trim() } else {
    $m2 = [regex]::Match($c, 'Checks\s*\d+', 'IgnoreCase')
    if ($m2.Success) { $status = $m2.Value.Trim() } else { $status = 'unknown' }
  }
  if ($status -ne $prev) {
    $prev = $status
    $t = (Get-Date).ToString()
    Write-Output "[$t] PR #5 status changed: $status"
  }
  Start-Sleep -Seconds 60
}