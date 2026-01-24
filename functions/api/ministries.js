// Cloudflare Function: /api/ministries
// Handles ministries API endpoints
import { query, queryOne, jsonResponse, handleOptions } from '../utils/database.js';

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
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

    try {
        const db = env.DB;
        const pathname = url.pathname;
        
        // GET /api/ministries/:id - Get single ministry
        const pathParts = pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart && lastPart !== 'ministries' && !isNaN(lastPart)) {
            const id = parseInt(lastPart);
            
            const ministry = await queryOne(
                db,
                'SELECT * FROM ministries WHERE id = ?',
                [id]
            );

            if (!ministry) {
                return jsonResponse({
                    success: false,
                    message: 'Ministry not found'
                }, 404);
            }

            return jsonResponse({
                success: true,
                data: ministry
            });
        }

        // GET /api/ministries - Get all ministries
        const status = url.searchParams.get('status') || 'active';

        const ministries = await query(
            db,
            `SELECT * FROM ministries 
             WHERE status = ? 
             ORDER BY name ASC`,
            [status]
        );

        return jsonResponse({
            success: true,
            data: ministries
        });

    } catch (error) {
        console.error('Error in ministries API:', error);
        return jsonResponse({
            success: false,
            message: 'Error fetching ministries'
        }, 500);
    }
}
