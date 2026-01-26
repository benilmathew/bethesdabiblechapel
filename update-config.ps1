# Update Config from .env
# Run this to update config.js with values from .env file

param()

# Read .env file
$envFile = ".env"
if (!(Test-Path $envFile)) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    exit 1
}

# Parse .env file
$envContent = Get-Content $envFile -Raw
$envVars = @{}

foreach ($line in ($envContent -split "`n")) {
    $line = $line.Trim()
    if ($line -and !$line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()
            $envVars[$key] = $value
        }
    }
}

# Update config.js
$configFile = "assets\js\config.js"
if (!(Test-Path $configFile)) {
    Write-Host "Error: config.js file not found!" -ForegroundColor Red
    exit 1
}

$configContent = Get-Content $configFile -Raw -Encoding UTF8

# Update ASSET_VERSION
if ($envVars.ContainsKey("ASSET_VERSION")) {
    $newVersion = $envVars["ASSET_VERSION"]
    $configContent = $configContent -replace "const ASSET_VERSION = '[^']*'", "const ASSET_VERSION = '$newVersion'"

    # Write back to file
    [System.IO.File]::WriteAllText($configFile, $configContent, [System.Text.Encoding]::UTF8)

    Write-Host "Updated config.js with ASSET_VERSION: $newVersion" -ForegroundColor Green
} else {
    Write-Host "Warning: ASSET_VERSION not found in .env file" -ForegroundColor Yellow
}

Write-Host "Config update complete!" -ForegroundColor Green