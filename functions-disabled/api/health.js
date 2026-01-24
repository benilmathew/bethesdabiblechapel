// Cloudflare Function: /api/health
// Health check endpoint
import { jsonResponse, handleOptions } from '../utils/database.js';

export async function onRequest(context) {
    const { request } = context;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        return handleOptions();
    }

    // Only allow GET requests
    if (method !== 'GET') {
        return jsonResponse({ 
            success: false, 
            message: 'Method not allowed' 
        }, 405);
    }

    return jsonResponse({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: 'cloudflare-pages'
    });
}
