param(
  [int]$PrNumber = 6
)

$owner = 'cortanaautomatizar-hub'
$repo = 'carbon-finance'
$pr = $PrNumber
$token = $env:GITHUB_TOKEN
if (-not $token) { $token = $env:GH_TOKEN }
if (-not $token) { Write-Output '[ERROR] No GITHUB_TOKEN or GH_TOKEN found in environment'; exit 2 }

$hdr = @{ Authorization = "token $token"; 'User-Agent' = 'meu-c6-merger'; Accept = 'application/vnd.github+json' }
$body = @{ commit_title = 'Refatoração concluída: Typescript strict, Lint 0 errors e Build fixado.'; commit_message = 'Refatoração concluída: Typescript strict, Lint 0 errors e Build fixado.'; merge_method = 'merge' } | ConvertTo-Json -Depth 4

try {
  $res = Invoke-RestMethod -Method Put -Uri "https://api.github.com/repos/$owner/$repo/pulls/$pr/merge" -Headers $hdr -Body $body -UseBasicParsing
  Write-Output "[OK] Merge result: $($res.message) -> sha=$($res.sha)"
} catch {
  Write-Output "[ERROR] Merge failed: $($_.Exception.Message)"
  exit 3
}