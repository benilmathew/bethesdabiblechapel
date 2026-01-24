// Cloudflare Function: /api/sermons
// Handles sermon API endpoints
import { query, queryOne, update, jsonResponse, handleOptions } from '../utils/database.js';

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
        
        // GET /api/sermons/featured/latest - Get latest sermon
        if (pathname.includes('/featured/latest')) {
            const sermon = await queryOne(
                db,
                `SELECT * FROM sermons 
                 WHERE status = 'published' 
                 ORDER BY date DESC 
                 LIMIT 1`,
                []
            );

            if (!sermon) {
                return jsonResponse({
                    success: false,
                    message: 'No sermons found'
                }, 404);
            }

            return jsonResponse({
                success: true,
                data: sermon
            });
        }

        // GET /api/sermons/series/list - Get all sermon series
        if (pathname.includes('/series/list')) {
            const series = await query(
                db,
                `SELECT series, COUNT(*) as count 
                 FROM sermons 
                 WHERE status = 'published' AND series IS NOT NULL AND series != ''
                 GROUP BY series 
                 ORDER BY series`,
                []
            );

            return jsonResponse({
                success: true,
                data: series
            });
        }

        // GET /api/sermons/speakers/list - Get all speakers
        if (pathname.includes('/speakers/list')) {
            const speakers = await query(
                db,
                `SELECT speaker, COUNT(*) as count 
                 FROM sermons 
                 WHERE status = 'published' 
                 GROUP BY speaker 
                 ORDER BY speaker`,
                []
            );

            return jsonResponse({
                success: true,
                data: speakers
            });
        }

        // GET /api/sermons/:id - Get single sermon
        const pathParts = pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart && lastPart !== 'sermons' && !isNaN(lastPart)) {
            const id = parseInt(lastPart);
            
            const sermon = await queryOne(
                db,
                `SELECT * FROM sermons WHERE id = ? AND status = 'published'`,
                [id]
            );

            if (!sermon) {
                return jsonResponse({
                    success: false,
                    message: 'Sermon not found'
                }, 404);
            }

            // Increment view count
            await update(
                db,
                'UPDATE sermons SET views = views + 1 WHERE id = ?',
                [id]
            );

            return jsonResponse({
                success: true,
                data: sermon
            });
        }

        // GET /api/sermons - Get all sermons with pagination
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 10;
        const offset = (page - 1) * limit;
        const series = url.searchParams.get('series');
        const speaker = url.searchParams.get('speaker');

        // Build query
        let sql = `
            SELECT id, title, speaker, date, description, 
                   audio_url, video_url, notes_url, image_url, 
                   scripture_reference, series, views
            FROM sermons 
            WHERE status = 'published'
        `;
        const params = [];

        if (series) {
            sql += ' AND series = ?';
            params.push(series);
        }

        if (speaker) {
            sql += ' AND speaker = ?';
            params.push(speaker);
        }

        sql += ' ORDER BY date DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const sermons = await query(db, sql, params);

        // Get total count
        let countSql = 'SELECT COUNT(*) as total FROM sermons WHERE status = "published"';
        const countParams = [];

        if (series) {
            countSql += ' AND series = ?';
            countParams.push(series);
        }

        if (speaker) {
            countSql += ' AND speaker = ?';
            countParams.push(speaker);
        }

        const countResult = await queryOne(db, countSql, countParams);
        const total = countResult ? countResult.total : 0;

        return jsonResponse({
            success: true,
            data: sermons,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(total / limit),
                total_items: total,
                items_per_page: limit
            }
        });

    } catch (error) {
        console.error('Error in sermons API:', error);
        return jsonResponse({
            success: false,
            message: 'Error fetching sermons'
        }, 500);
    }
}
