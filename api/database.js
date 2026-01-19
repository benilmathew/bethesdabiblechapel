const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bethesda_church',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Execute query
async function query(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Get single row
async function queryOne(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return results[0] || null;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Insert and return ID
async function insert(sql, params) {
    try {
        const [result] = await pool.execute(sql, params);
        return result.insertId;
    } catch (error) {
        console.error('Database insert error:', error);
        throw error;
    }
}

// Update
async function update(sql, params) {
    try {
        const [result] = await pool.execute(sql, params);
        return result.affectedRows;
    } catch (error) {
        console.error('Database update error:', error);
        throw error;
    }
}

// Delete
async function remove(sql, params) {
    try {
        const [result] = await pool.execute(sql, params);
        return result.affectedRows;
    } catch (error) {
        console.error('Database delete error:', error);
        throw error;
    }
}

// Close pool
async function close() {
    try {
        await pool.end();
        console.log('Database connection pool closed');
    } catch (error) {
        console.error('Error closing database pool:', error);
    }
}

module.exports = {
    pool,
    query,
    queryOne,
    insert,
    update,
    remove,
    close,
    testConnection
};
