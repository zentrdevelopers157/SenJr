$json = Get-Content project_details.json -Raw | ConvertFrom-Json
$json.PSObject.Properties | Select-Object -Property Name, Value | ConvertTo-Json
