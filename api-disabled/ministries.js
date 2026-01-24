const express = require('express');
const router = express.Router();
const db = require('./database');

// GET /api/ministries - Get all ministries
router.get('/', async (req, res) => {
    try {
        const status = req.query.status || 'active';

        const ministries = await db.query(
            `SELECT * FROM ministries 
             WHERE status = ? 
             ORDER BY name ASC`,
            [status]
        );

        res.json({
            success: true,
            data: ministries
        });
    } catch (error) {
        console.error('Error fetching ministries:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching ministries'
        });
    }
});

// GET /api/ministries/:id - Get single ministry
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const ministry = await db.queryOne(
            'SELECT * FROM ministries WHERE id = ?',
            [id]
        );

        if (!ministry) {
            return res.status(404).json({
                success: false,
                message: 'Ministry not found'
            });
        }

        res.json({
            success: true,
            data: ministry
        });
    } catch (error) {
        console.error('Error fetching ministry:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching ministry'
        });
    }
});

module.exports = router;
