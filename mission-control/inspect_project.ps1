$headers = @{
    Authorization = "Bearer vca_8OsFo1ha4YH4TW1Q9a8ADR9ArQX7mkwb0V30M1LNqh9sVWWTtR15tQXY"
}
$response = Invoke-RestMethod -Method Get -Uri "https://api.vercel.com/v9/projects/mission-control" -Headers $headers
$response | ConvertTo-Json -Depth 10
