# Cache Busting Update Script (DEPRECATED)
# This script is deprecated. Use update-config.ps1 instead.
#
# New workflow:
# 1. Update ASSET_VERSION in .env file
# 2. Run: .\update-config.ps1
# 3. The config.js will be updated automatically
#
# This provides better maintainability and doesn't require updating HTML files.

Write-Host "DEPRECATED: This script is no longer needed!" -ForegroundColor Yellow
Write-Host "Use the new .env-based system instead:" -ForegroundColor Cyan
Write-Host "  1. Edit .env file: ASSET_VERSION=1.0.18" -ForegroundColor White
Write-Host "  2. Run: .\update-config.ps1" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "This keeps version management in one place and is much cleaner!" -ForegroundColor Green

# Exit without doing anything
exit 0

# Get all HTML files
$htmlFiles = Get-ChildItem -Path "c:\Users\benil\OneDrive\Documents\Code\Bethesda" -Filter "*.html" -Recurse | Where-Object { $_.FullName -notlike "*node_modules*" }

foreach ($file in $htmlFiles) {
    Write-Host "Updating: $($file.FullName)" -ForegroundColor Yellow

    try {
        # Read file content with UTF-8 encoding
        $content = Get-Content $file.FullName -Raw -Encoding UTF8

        # Update version in window.ASSET_VERSION
        $content = $content -replace "window\.ASSET_VERSION = '[^']*'", "window.ASSET_VERSION = '$NewVersion'"

        # Update all asset URLs with new version (existing versions)
        $content = $content -replace "\?v=[^'""]*", "?v=$NewVersion"

        # Add version to script tags that don't have version parameters
        $content = $content -replace '(<script[^>]*src="[^"]*\.js)(["][^>]*>)', "`$1?v=$NewVersion`$2"
        $content = $content -replace "(<script[^>]*src='[^']*\.js)(['][^>]*>)", "`$1?v=$NewVersion`$2"

        # Add version to CSS link tags that don't have version parameters
        $content = $content -replace '(<link[^>]*href="[^"]*\.css)(["][^>]*>)', "`$1?v=$NewVersion`$2"
        $content = $content -replace "(<link[^>]*href='[^']*\.css)(['][^>]*>)", "`$1?v=$NewVersion`$2"

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