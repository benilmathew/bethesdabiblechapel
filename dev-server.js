/**
 * Simple Development Server for Bethesda Bible Chapel
 * Serves static files with proper MIME types
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

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

const server = http.createServer((req, res) => {
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
    console.log(`  ✓ Press Ctrl+C to stop\n`);
    console.log('  📁 Serving files from:', __dirname);
    console.log('\n  💡 Open in browser: http://localhost:' + PORT);
    console.log('═══════════════════════════════════════════\n');
});
