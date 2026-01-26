# Cache Busting Update Script
# Run this script to update the asset version across all HTML files

param(
    [string]$NewVersion = "1.0.2"
)

Write-Host "Updating cache busting version to: $NewVersion" -ForegroundColor Green

# Get all HTML files
$htmlFiles = Get-ChildItem -Path "c:\Users\benil\OneDrive\Documents\Code\Bethesda" -Filter "*.html" -Recurse | Where-Object { $_.FullName -notlike "*node_modules*" }

foreach ($file in $htmlFiles) {
    Write-Host "Updating: $($file.FullName)" -ForegroundColor Yellow

    try {
        # Read file content with UTF-8 encoding
        $content = Get-Content $file.FullName -Raw -Encoding UTF8

        # Update version in window.ASSET_VERSION
        $content = $content -replace "window\.ASSET_VERSION = '[^']*'", "window.ASSET_VERSION = '$NewVersion'"

        # Update all asset URLs with new version
        $content = $content -replace "\?v=[^'""]*", "?v=$NewVersion"

        # Write back to file with UTF-8 encoding (without BOM)
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    }
    catch {
        Write-Host "Error updating $($file.FullName): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Cache busting update complete!" -ForegroundColor Green
Write-Host "New version: $NewVersion" -ForegroundColor Cyan

Write-Host "Cache busting update complete!" -ForegroundColor Green
Write-Host "New version: $NewVersion" -ForegroundColor Cyan