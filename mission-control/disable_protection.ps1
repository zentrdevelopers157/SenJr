$headers = @{
    Authorization = "Bearer vca_8OsFo1ha4YH4TW1Q9a8ADR9ArQX7mkwb0V30M1LNqh9sVWWTtR15tQXY"
    "Content-Type" = "application/json"
}
$body = @{
    deploymentProtection = @{
        vercelAuthentication = "disabled"
    }
} | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Method Patch -Uri "https://api.vercel.com/v9/projects/mission-control" -Headers $headers -Body $body
    Write-Output "Successfully updated project settings."
    $response | ConvertTo-Json
} catch {
    Write-Error "Failed to update project settings: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $errResp = $reader.ReadToEnd()
        Write-Output "Error Response: $errResp"
    }
}
