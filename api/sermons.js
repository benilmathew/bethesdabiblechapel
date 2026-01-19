const express = require('express');
const router = express.Router();
const db = require('./database');

// GET /api/sermons - Get all sermons with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const series = req.query.series;
        const speaker = req.query.speaker;

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

        const sermons = await db.query(sql, params);

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

        const countResult = await db.queryOne(countSql, countParams);
        const total = countResult.total;

        res.json({
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
        console.error('Error fetching sermons:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sermons'
        });
    }
});

// GET /api/sermons/:id - Get single sermon
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const sermon = await db.queryOne(
            `SELECT * FROM sermons WHERE id = ? AND status = 'published'`,
            [id]
        );

        if (!sermon) {
            return res.status(404).json({
                success: false,
                message: 'Sermon not found'
            });
        }

        // Increment view count
        await db.update(
            'UPDATE sermons SET views = views + 1 WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            data: sermon
        });
    } catch (error) {
        console.error('Error fetching sermon:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sermon'
        });
    }
});

// GET /api/sermons/featured/latest - Get latest sermon
router.get('/featured/latest', async (req, res) => {
    try {
        const sermon = await db.queryOne(
            `SELECT * FROM sermons 
             WHERE status = 'published' 
             ORDER BY date DESC 
             LIMIT 1`
        );

        if (!sermon) {
            return res.status(404).json({
                success: false,
                message: 'No sermons found'
            });
        }

        res.json({
            success: true,
            data: sermon
        });
    } catch (error) {
        console.error('Error fetching latest sermon:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching latest sermon'
        });
    }
});

// GET /api/sermons/series/list - Get all sermon series
router.get('/series/list', async (req, res) => {
    try {
        const series = await db.query(
            `SELECT DISTINCT series, COUNT(*) as count 
             FROM sermons 
             WHERE status = 'published' AND series IS NOT NULL 
             GROUP BY series 
             ORDER BY series`
        );

        res.json({
            success: true,
            data: series
        });
    } catch (error) {
        console.error('Error fetching series:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching series'
        });
    }
});

// GET /api/sermons/speakers/list - Get all speakers
router.get('/speakers/list', async (req, res) => {
    try {
        const speakers = await db.query(
            `SELECT DISTINCT speaker, COUNT(*) as count 
             FROM sermons 
             WHERE status = 'published' 
             GROUP BY speaker 
             ORDER BY speaker`
        );

        res.json({
            success: true,
            data: speakers
        });
    } catch (error) {
        console.error('Error fetching speakers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching speakers'
        });
    }
});

module.exports = router;
