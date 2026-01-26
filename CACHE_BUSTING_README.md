# Cache Busting System

This project uses a centralized configuration system for cache busting instead of manually updating HTML files.

## How It Works

All asset URLs include a version parameter (`?v=1.0.17`) that forces browsers to download fresh copies when the version changes. The version is managed centrally in a `.env` file and loaded via `config.js`.

## Benefits

- ✅ Forces browser cache refresh for updated assets
- ✅ No need to hard refresh (Ctrl+F5) for users
- ✅ Single source of truth for version management
- ✅ No need to update multiple HTML files manually
- ✅ Simple to implement and maintain
- ✅ Works across all browsers and devices
- ✅ No build process required
- ✅ JavaScript utility for dynamic content
- ✅ Automated update script for batch processing

## Files Involved

- **Configuration**: `.env`, `assets/js/config.js`
- **CSS Files**: `assets/css/main.css`, `assets/css/responsive.css`
- **JavaScript Files**: `assets/js/components.js`, `assets/js/main.js`, `assets/js/cache-busting.js`
- **Images**: All favicon files and preload images
- **HTML Files**: All `.html` files load `config.js` automatically
- **Scripts**: `build-config.js` (Node.js), `update-config.ps1` (PowerShell), `update-cache-version.ps1` (deprecated)

## Updating Asset Versions (Automated Methods)

When you make changes to CSS, JS, or images and want to force browsers to reload them:

### Option 1: npm build (Recommended)
```bash
# Edit .env file: ASSET_VERSION=1.0.20
# Then run:
npm run build

# This automatically updates config.js from .env
```

### Option 2: Direct Node.js
```bash
# Edit .env file: ASSET_VERSION=1.0.20
node build-config.js
```

### Option 3: PowerShell (Legacy)
```powershell
# Edit .env file: ASSET_VERSION=1.0.20
.\update-config.ps1
```

## How config.js Gets Updated

The `config.js` file is **auto-generated** from `.env`:

1. **`.env`** contains: `ASSET_VERSION=1.0.19`
2. **`build-config.js`** reads `.env` and generates `config.js`
3. **`config.js`** exports the version for use by other scripts

This ensures `config.js` always stays in sync with your environment variables.

## Build Process

The build system automatically generates `config.js` from `.env`:

- **`build-config.js`**: Node.js script that parses `.env` and generates `config.js`
- **`package.json`**: Contains `npm run build` script
- **Auto-generated**: `config.js` includes timestamp and "DO NOT EDIT DIRECTLY" warning

### Integration with Development Workflow

You can integrate this into your deployment process:

```bash
# Before deploying
npm run build
git add assets/js/config.js
git commit -m "Build config for v1.0.19"
git push
```

## Version Number Format

Use semantic versioning format: `MAJOR.MINOR.PATCH`
- `MAJOR`: Breaking changes
- `MINOR`: New features
- `PATCH`: Bug fixes and small updates

## Migration from Old System

The old `update-cache-version.ps1` script is deprecated. All HTML files now load `config.js` which provides the version dynamically. The old script will show deprecation warnings.

## JavaScript Configuration

All HTML pages now load `config.js` which provides:

```javascript
window.APP_CONFIG = {
    ASSET_VERSION: '1.0.17'
};
```

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
// Result: 'assets/images/photo.jpg?v=1.0.17'

// Apply to dynamically loaded images
applyCacheBusting('img.lazy-load', 'src');
```

## Important Notes

⚠️ **Unicode Character Preservation**: The update script preserves Unicode characters (emojis, special symbols) using UTF-8 encoding. If you manually edit HTML files containing emojis, ensure your editor saves with UTF-8 encoding.

⚠️ **File Encoding**: Always use UTF-8 encoding when editing HTML files to prevent emoji corruption.

⚠️ **Single Source of Truth**: Only update the version in `.env` - the scripts will handle the rest automatically.