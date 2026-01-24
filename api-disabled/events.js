const express = require('express');
const router = express.Router();
const db = require('./database');

// GET /api/events - Get all events
router.get('/', async (req, res) => {
    try {
        const type = req.query.type || 'upcoming'; // upcoming, past, all
        const category = req.query.category;

        let sql = `
            SELECT id, title, description, date, start_time, end_time, 
                   location, image_url, category, registration_required, max_attendees
            FROM events 
            WHERE status = 'published'
        `;
        const params = [];

        if (type === 'upcoming') {
            sql += ' AND date >= CURDATE()';
        } else if (type === 'past') {
            sql += ' AND date < CURDATE()';
        }

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        sql += ' ORDER BY date ASC, start_time ASC';

        const events = await db.query(sql, params);

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events'
        });
    }
});

// GET /api/events/:id - Get single event
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const event = await db.queryOne(
            `SELECT * FROM events WHERE id = ? AND status = 'published'`,
            [id]
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching event'
        });
    }
});

// GET /api/events/categories/list - Get all categories
router.get('/categories/list', async (req, res) => {
    try {
        const categories = await db.query(
            `SELECT DISTINCT category, COUNT(*) as count 
             FROM events 
             WHERE status = 'published' 
             GROUP BY category 
             ORDER BY category`
        );

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
});

// GET /api/events/upcoming/featured - Get next 3 upcoming events
router.get('/upcoming/featured', async (req, res) => {
    try {
        const events = await db.query(
            `SELECT * FROM events 
             WHERE status = 'published' AND date >= CURDATE()
             ORDER BY date ASC, start_time ASC 
             LIMIT 3`
        );

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Error fetching featured events:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured events'
        });
    }
});

module.exports = router;
