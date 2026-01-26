# Cache Busting System

This project uses a simple cache busting system to ensure browsers always load the latest versions of CSS, JavaScript, and image assets.

## How It Works

All asset URLs include a version parameter (`?v=1.0.1`) that forces browsers to download fresh copies when the version changes.

## Benefits

- ✅ Forces browser cache refresh for updated assets
- ✅ No need to hard refresh (Ctrl+F5) for users
- ✅ Simple to implement and maintain
- ✅ Works across all browsers and devices
- ✅ No build process required
- ✅ JavaScript utility for dynamic content
- ✅ Automated update script for batch processing

## Files Updated

- **CSS Files**: `assets/css/main.css`, `assets/css/responsive.css`
- **JavaScript Files**: `assets/js/components.js`, `assets/js/main.js`, `assets/js/cache-busting.js`
- **Images**: All favicon files and preload images
- **HTML Files**: All `.html` files in root and `pages/` directory
- **Utilities**: `update-cache-version.ps1`, `CACHE_BUSTING_README.md`

## Updating Asset Versions

When you make changes to CSS, JS, or images and want to force browsers to reload them:

### Option 1: Manual Update
1. Edit the version number in `window.ASSET_VERSION = '1.0.1';` in any HTML file
2. Update all `?v=1.0.1` parameters to match

### Option 2: Automated Update (Recommended)
Run the PowerShell script to update all files at once:

```powershell
.\update-cache-version.ps1 -NewVersion "1.0.2"
```

This will:
- Update the `window.ASSET_VERSION` variable
- Update all asset URLs with the new version parameter
- Process all HTML files automatically

## Version Number Format

Use semantic versioning format: `MAJOR.MINOR.PATCH`
- `MAJOR`: Breaking changes
- `MINOR`: New features
- `PATCH`: Bug fixes and small updates

## JavaScript Utility

For dynamic content or future enhancements, use the cache busting utility:

```html
<script src="assets/js/cache-busting.js"></script>
```

### Utility Functions

- `addCacheBusting(url, version)` - Add version parameter to any URL
- `applyCacheBusting(selector, attribute)` - Apply to multiple elements
- `initCacheBusting()` - Auto-initialize for common cases

### Example Usage

```javascript
// Add cache busting to a single URL
const imageUrl = addCacheBusting('assets/images/photo.jpg');
// Result: 'assets/images/photo.jpg?v=1.0.1'

// Apply to dynamically loaded images
applyCacheBusting('img.lazy-load', 'src');
```

## Important Notes

⚠️ **Unicode Character Preservation**: The update script preserves Unicode characters (emojis, special symbols) using UTF-8 encoding. If you manually edit HTML files containing emojis, ensure your editor saves with UTF-8 encoding.

⚠️ **File Encoding**: Always use UTF-8 encoding when editing HTML files to prevent emoji corruption.