// Database utility for Cloudflare D1
// Provides consistent interface for database operations

/**
 * Execute a SELECT query and return all results
 * @param {D1Database} db - Cloudflare D1 database instance
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export async function query(db, sql, params = []) {
    try {
        const result = await db.prepare(sql).bind(...params).all();
        return result.results || [];
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Execute a SELECT query and return first result
 * @param {D1Database} db - Cloudflare D1 database instance
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object|null>} First result or null
 */
export async function queryOne(db, sql, params = []) {
    try {
        const result = await db.prepare(sql).bind(...params).first();
        return result || null;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Execute an INSERT query and return the last inserted row ID
 * @param {D1Database} db - Cloudflare D1 database instance
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<number>} Last inserted row ID
 */
export async function insert(db, sql, params = []) {
    try {
        const result = await db.prepare(sql).bind(...params).run();
        return result.meta.last_row_id;
    } catch (error) {
        console.error('Database insert error:', error);
        throw error;
    }
}

/**
 * Execute an UPDATE or DELETE query
 * @param {D1Database} db - Cloudflare D1 database instance
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<number>} Number of affected rows
 */
export async function update(db, sql, params = []) {
    try {
        const result = await db.prepare(sql).bind(...params).run();
        return result.meta.changes;
    } catch (error) {
        console.error('Database update error:', error);
        throw error;
    }
}

/**
 * Create a JSON response
 * @param {Object} data - Response data
 * @param {number} status - HTTP status code
 * @returns {Response} JSON response
 */
export function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

/**
 * Handle OPTIONS request for CORS
 * @returns {Response} CORS response
 */
export function handleOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        }
    });
}

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {Array<string>} requiredFields - List of required field names
 * @returns {Array<string>} Array of validation errors
 */
export function validateFields(body, requiredFields) {
    const errors = [];
    
    for (const field of requiredFields) {
        if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
            errors.push(`${field} is required`);
        }
    }
    
    return errors;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
