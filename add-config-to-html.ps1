# Add Config Script to HTML Files
# Adds config.js script tag to all HTML files that don't already have it

# Get all HTML files
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -Recurse | Where-Object { $_.FullName -notlike "*node_modules*" }

foreach ($file in $htmlFiles) {
    Write-Host "Checking: $($file.Name)" -ForegroundColor Yellow

    try {
        # Read file content
        $content = Get-Content $file.FullName -Raw -Encoding UTF8

        # Check if config.js is already included
        if ($content -notmatch 'config\.js') {
            # Find the favicon section and add config.js after it
            if ($content -match '(<!-- Favicon -->.*?</link>\s*(?=<!--|\s*<link|\s*<script|$))') {
                $faviconSection = $matches[0]
                $configScript = "`n    <!-- Configuration and Cache Busting -->`n    <script src=`"assets/js/config.js`"></script>`n    "
                $content = $content -replace [regex]::Escape($faviconSection), $faviconSection + $configScript
            }
            # For pages/ directory, use relative path
            elseif ($file.FullName -like "*\pages\*") {
                $content = $content -replace '(<!-- Favicon -->.*?</link>\s*(?=<!--|\s*<link|\s*<script|$))', "`$&`n    <!-- Configuration and Cache Busting -->`n    <script src=`"../assets/js/config.js`"></script>`n    "
            }

            # Write back to file
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "  Added config.js to $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "  config.js already present in $($file.Name)" -ForegroundColor Cyan
        }
    }
    catch {
        Write-Host "Error updating $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nConfig script addition complete!" -ForegroundColor Green