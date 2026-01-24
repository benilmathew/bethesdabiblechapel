/**
 * Development Server with Live Reload for Bethesda Bible Chapel
 * Serves static files with proper MIME types and auto-reload on file changes
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const RELOAD_PORT = 35729; // Standard LiveReload port

// Track connected clients for live reload
const clients = new Set();

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf'
};

// LiveReload script injection
const liveReloadScript = `
<script>
(function() {
    console.log('🔄 Live reload enabled');
    const connect = () => {
        const ws = new WebSocket('ws://localhost:${RELOAD_PORT}');
        ws.onmessage = (msg) => {
            if (msg.data === 'reload') {
                console.log('📡 Changes detected - reloading...');
                window.location.reload();
            }
        };
        ws.onclose = () => {
            console.log('🔌 Reconnecting...');
            setTimeout(connect, 1000);
        };
    };
    connect();
})();
</script>
</body>`;

const server = http.createServer((req, res) => {
    // Handle WebSocket upgrade for live reload
    if (req.url === '/livereload') {
        return;
    }
    
    // Parse URL and remove query parameters
    let filePath = '.' + req.url.split('?')[0];
    
    // Default to index.html
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                // Server error
                res.writeHead(500);
                res.end('Server Error: ' + error.code, 'utf-8');
            }
        } else {
            // Inject live reload script into HTML files
            if (extname === '.html') {
                content = content.toString().replace('</body>', liveReloadScript);
            }
            
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\n═══════════════════════════════════════════');
    console.log('  🚀 Bethesda Bible Chapel - Dev Server');
    console.log('═══════════════════════════════════════════\n');
    console.log(`  ✓ Server running at: http://localhost:${PORT}`);
    console.log(`  ✓ Live reload enabled on port ${RELOAD_PORT}`);
    console.log(`  ✓ Press Ctrl+C to stop\n`);
    console.log('  📁 Serving files from:', __dirname);
    console.log('\n  💡 Open in browser: http://localhost:' + PORT);
    console.log('  🔄 Changes will auto-reload the browser');
    console.log('═══════════════════════════════════════════\n');
});

// WebSocket server for live reload
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: RELOAD_PORT });

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('🔌 Browser connected for live reload');
    
    ws.on('close', () => {
        clients.delete(ws);
    });
});

// File watcher - watches for changes in the project
const watchDirectories = ['.', './pages', './assets', './components'];
const watchExtensions = ['.html', '.css', '.js', '.json'];

function shouldWatch(filePath) {
    const ext = path.extname(filePath);
    return watchExtensions.includes(ext) && !filePath.includes('node_modules');
}

function notifyReload() {
    console.log(`🔄 File changed - reloading ${clients.size} connected browser(s)...`);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
        }
    });
}

// Watch each directory recursively
function watchDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename && shouldWatch(filename)) {
            notifyReload();
        }
    });
}

watchDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
        watchDirectory(dir);
        console.log(`👀 Watching: ${dir}`);
    }
});

console.log('\n✅ File watcher active - editing files will trigger reload\n');
