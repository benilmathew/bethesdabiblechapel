// Cloudflare Function: /api/events
// Handles events API endpoints
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
        
        // GET /api/events/categories/list - Get all categories
        if (pathname.includes('/categories/list')) {
            const categories = await query(
                db,
                `SELECT category, COUNT(*) as count 
                 FROM events 
                 WHERE status = 'published' AND category IS NOT NULL AND category != ''
                 GROUP BY category 
                 ORDER BY category`,
                []
            );

            return jsonResponse({
                success: true,
                data: categories
            });
        }

        // GET /api/events/upcoming/featured - Get next 3 upcoming events
        if (pathname.includes('/upcoming/featured')) {
            const events = await query(
                db,
                `SELECT * FROM events 
                 WHERE status = 'published' AND date >= date('now')
                 ORDER BY date ASC, start_time ASC 
                 LIMIT 3`,
                []
            );

            return jsonResponse({
                success: true,
                data: events
            });
        }

        // GET /api/events/:id - Get single event
        const pathParts = pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart && lastPart !== 'events' && !isNaN(lastPart)) {
            const id = parseInt(lastPart);
            
            const event = await queryOne(
                db,
                `SELECT * FROM events WHERE id = ? AND status = 'published'`,
                [id]
            );

            if (!event) {
                return jsonResponse({
                    success: false,
                    message: 'Event not found'
                }, 404);
            }

            return jsonResponse({
                success: true,
                data: event
            });
        }

        // GET /api/events - Get all events
        const type = url.searchParams.get('type') || 'upcoming';
        const category = url.searchParams.get('category');

        let sql = `
            SELECT id, title, description, date, start_time, end_time, 
                   location, image_url, category, registration_required, max_attendees
            FROM events 
            WHERE status = 'published'
        `;
        const params = [];

        if (type === 'upcoming') {
            sql += ' AND date >= date("now")';
        } else if (type === 'past') {
            sql += ' AND date < date("now")';
        }

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        sql += ' ORDER BY date ASC, start_time ASC';

        const events = await query(db, sql, params);

        return jsonResponse({
            success: true,
            data: events
        });

    } catch (error) {
        console.error('Error in events API:', error);
        return jsonResponse({
            success: false,
            message: 'Error fetching events'
        }, 500);
    }
}
