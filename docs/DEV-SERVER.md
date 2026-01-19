# Development Server Guide

## Quick Start

The Bethesda Bible Chapel website includes a simple Node.js development server for local testing.

### Start the Server

```bash
# Option 1: Using npm (recommended)
npm run serve

# Option 2: Direct command
node dev-server.js
```

The server will start at **http://localhost:8000**

## Why Do You Need a Server?

The website uses **component-based architecture** where header and footer are loaded dynamically via JavaScript `fetch()` API. Modern browsers block fetch requests when opening HTML files directly (`file://` protocol) due to CORS security policies.

**Solution:** Run a local web server that serves files via `http://` protocol.

## Server Features

✅ **Simple & Fast** - Lightweight Node.js HTTP server  
✅ **Proper MIME Types** - Correctly serves HTML, CSS, JS, images, fonts  
✅ **Clean URLs** - Automatically serves index.html for root  
✅ **Error Handling** - Shows friendly 404 and 500 error pages  
✅ **Easy to Extend** - Add custom routes or middleware as needed  

## Server Commands

```bash
# Development server (static files only)
npm run serve

# Full backend server (with database & APIs)
npm start

# Development mode with auto-reload
npm run dev
```

## How It Works

1. **Server Script:** `dev-server.js`
   - Creates HTTP server on port 8000
   - Serves static files from project root
   - Handles all file types (HTML, CSS, JS, images, fonts)

2. **Component Loading:** `assets/js/components.js`
   - Fetches `components/header.html`
   - Fetches `components/footer.html`
   - Injects into placeholder divs
   - Works because server allows fetch requests

3. **Result:** All pages display header and footer correctly!

## Development Workflow

1. **Start server** (keep it running)
   ```bash
   npm run serve
   ```

2. **Open browser**
   - Navigate to http://localhost:8000
   - Browse any page

3. **Make changes**
   - Edit `components/header.html` or `components/footer.html`
   - Save the file

4. **See results**
   - Refresh browser
   - Changes appear on all 12 pages instantly!

## Troubleshooting

### Port Already in Use

If port 8000 is taken, edit `dev-server.js`:

```javascript
const PORT = 3000; // Change to any available port
```

### Components Not Loading

1. Check browser console (F12) for errors
2. Verify server is running (check terminal)
3. Ensure you're accessing via `http://localhost:8000` (not `file://`)
4. Check that `components/` folder exists with `header.html` and `footer.html`

### Cannot Find Module

Make sure Node.js is installed:
```bash
node --version  # Should show v14 or higher
```

## Alternative Servers

### Using Python
```bash
python -m http.server 8000
# or
python3 -m http.server 8000
```

### Using VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Automatically opens and auto-refreshes on changes!

### Using npx http-server
```bash
npx http-server -p 8000
```

## Stopping the Server

Press **Ctrl+C** in the terminal where the server is running.

## Production Deployment

For production, you don't need the dev server. The component system works on:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Any static hosting**

These platforms serve files via HTTP/HTTPS, so fetch() works without issues.

## Next Steps

- Keep server running during development
- Edit components for site-wide changes
- Add backend APIs when ready (use `npm start` instead)
- Deploy to hosting when satisfied with design

---

**Quick Reference:**

```bash
# Start dev server
npm run serve

# Open browser
http://localhost:8000

# Stop server
Ctrl+C
```
