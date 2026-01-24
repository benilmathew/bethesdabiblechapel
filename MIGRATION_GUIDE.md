# Migration Guide: Express/MySQL to Cloudflare Pages/D1

This document explains the changes made to convert the Bethesda Bible Chapel website from a traditional Express/MySQL stack to Cloudflare Pages with D1 database.

## Overview of Changes

### Before (Traditional Stack)
- **Backend**: Node.js + Express server
- **Database**: MySQL (requires separate hosting)
- **Email**: Nodemailer with SMTP
- **Hosting**: Requires VPS or dedicated hosting
- **Scaling**: Manual server scaling
- **Cost**: $5-50/month for hosting + database

### After (Cloudflare Pages)
- **Backend**: Cloudflare Functions (serverless)
- **Database**: Cloudflare D1 (SQLite-based)
- **Email**: Mailchannels (free with Cloudflare)
- **Hosting**: Cloudflare Pages (free tier)
- **Scaling**: Automatic, unlimited
- **Cost**: FREE for most church websites

## File Structure Changes

### New Files Added
```
├── wrangler.toml           # Cloudflare configuration
├── schema.sql              # D1 database schema (SQLite)
├── _headers                # HTTP headers configuration
├── _redirects              # URL redirect rules
├── .node-version           # Node.js version specification
├── .dev.vars.example       # Cloudflare environment variables
├── CLOUDFLARE_SETUP.md     # Deployment guide
├── functions/              # NEW: Cloudflare Functions
│   ├── api/
│   │   ├── sermons.js      # Converted from Express route
│   │   ├── events.js       # Converted from Express route
│   │   ├── contact.js      # Converted from Express route
│   │   ├── ministries.js   # Converted from Express route
│   │   └── health.js       # Health check endpoint
│   └── utils/
│       └── database.js     # D1 database helper
```

### Files Updated
```
├── package.json            # Added Cloudflare scripts
├── README.md               # Updated with Cloudflare instructions
├── START_HERE.md           # Updated deployment options
├── .gitignore              # Added Cloudflare-specific files
```

### Legacy Files Kept (for reference)
```
├── server.js               # Original Express server
├── dev-server.js           # Simple static file server
├── api/                    # Original Express API routes
│   ├── database.js         # MySQL connection
│   ├── database.sql        # MySQL schema
│   ├── sermons.js          # Express route
│   ├── events.js           # Express route
│   ├── contact.js          # Express route (with Nodemailer)
│   └── ministries.js       # Express route
```

## Code Changes Explained

### 1. API Routes: Express → Cloudflare Functions

**Before (Express):**
```javascript
// api/sermons.js
const express = require('express');
const router = express.Router();
const db = require('./database');

router.get('/', async (req, res) => {
    const sermons = await db.query('SELECT * FROM sermons');
    res.json({ success: true, data: sermons });
});

module.exports = router;
```

**After (Cloudflare Function):**
```javascript
// functions/api/sermons.js
import { query, jsonResponse, handleOptions } from '../utils/database.js';

export async function onRequest(context) {
    const { request, env } = context;
    
    if (request.method === 'OPTIONS') {
        return handleOptions();
    }
    
    const db = env.DB;
    const sermons = await query(db, 'SELECT * FROM sermons', []);
    return jsonResponse({ success: true, data: sermons });
}
```

**Key Differences:**
- Uses ES6 `export` instead of `module.exports`
- Function is named `onRequest` (Cloudflare requirement)
- Database accessed via `context.env.DB` binding
- Returns `Response` object instead of using `res.json()`
- Must handle CORS manually

### 2. Database: MySQL → Cloudflare D1

**Before (MySQL):**
```javascript
// api/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function query(sql, params) {
    const [results] = await pool.execute(sql, params);
    return results;
}
```

**After (D1):**
```javascript
// functions/utils/database.js
export async function query(db, sql, params = []) {
    const result = await db.prepare(sql).bind(...params).all();
    return result.results || [];
}
```

**Key Differences:**
- D1 uses prepared statements with `.prepare().bind()`
- D1 returns `.results` array
- No connection pooling needed (serverless)
- Database instance passed as parameter

### 3. SQL Schema: MySQL → SQLite

**MySQL Syntax:**
```sql
CREATE TABLE sermons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**SQLite (D1) Syntax:**
```sql
CREATE TABLE sermons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'published' CHECK(status IN ('draft', 'published', 'archived')),
    created_at TEXT DEFAULT (datetime('now'))
);
```

**Key Differences:**
- `INT` → `INTEGER`
- `VARCHAR` → `TEXT`
- `AUTO_INCREMENT` → `AUTOINCREMENT`
- `ENUM` → `TEXT` with `CHECK` constraint
- `DATE` → `TEXT` (store as ISO 8601)
- `TIMESTAMP` → `TEXT` with `datetime('now')`
- `CURDATE()` → `date('now')`
- `NOW()` → `datetime('now')`

### 4. Email: Nodemailer → Mailchannels

**Before (Nodemailer):**
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: subject,
    html: html
});
```

**After (Mailchannels):**
```javascript
async function sendEmail(to, subject, html, env) {
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: {
                email: env.FROM_EMAIL,
                name: env.FROM_NAME
            },
            subject: subject,
            content: [{ type: 'text/html', value: html }]
        })
    });
}
```

**Key Differences:**
- Uses Mailchannels API instead of SMTP
- No SMTP credentials needed
- Free with Cloudflare Workers
- Environment variables accessed via `env` parameter

### 5. Environment Variables

**Before (.env file):**
```bash
# .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
SMTP_HOST=smtp.gmail.com
SMTP_USER=user@gmail.com
```

**After (.dev.vars for local, Dashboard for production):**
```bash
# .dev.vars (local development)
FROM_EMAIL=noreply@church.org
FROM_NAME=Church Name
CONTACT_EMAIL=admin@church.org
SITE_NAME=Church Name
```

**Key Differences:**
- No database credentials (D1 uses bindings)
- No SMTP credentials (Mailchannels is free)
- Simplified configuration
- Production variables set in Cloudflare Dashboard

### 6. CORS Handling

**Before (Express middleware):**
```javascript
const cors = require('cors');
app.use(cors());
```

**After (Cloudflare Functions):**
```javascript
// In _headers file
/api/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type

// In each function
export function handleOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
```

## Development Workflow Changes

### Before (Express/MySQL)
```bash
# Start MySQL
mysql.server start

# Set up database
mysql -u root -p < api/database.sql

# Configure environment
cp .env.example .env
# Edit .env with credentials

# Install dependencies
npm install

# Start server
npm run dev

# Access at http://localhost:3000
```

### After (Cloudflare Pages)
```bash
# No database server to start!

# Set up D1 database
wrangler d1 create bethesda_church
wrangler d1 execute bethesda_church --local --file=./schema.sql

# Configure environment
cp .dev.vars.example .dev.vars
# Edit .dev.vars (fewer variables needed)

# Install dependencies
npm install

# Start server
npm run dev

# Access at http://localhost:8788
```

## Deployment Changes

### Before (Traditional Hosting)
```bash
# Requires:
# - VPS or shared hosting account
# - MySQL database server
# - SSH access
# - Manual deployment process

# Deploy steps:
scp -r * user@server:/var/www/
ssh user@server
cd /var/www
npm install
pm2 restart server
```

### After (Cloudflare Pages)
```bash
# Automatic deployment from Git!

# Option 1: Connect GitHub (recommended)
# - Push to GitHub
# - Cloudflare automatically deploys

# Option 2: Manual deployment
wrangler pages deploy .

# That's it! Site is live globally.
```

## Breaking Changes

### 1. Route Pattern Matching

Express supported flexible routing patterns. Cloudflare Functions use file-based routing:

**Express:**
```javascript
app.get('/api/sermons/:id', handler);
app.get('/api/sermons/featured/latest', handler);
```

**Cloudflare:**
- `/api/sermons.js` handles `/api/sermons` and `/api/sermons/*`
- Must parse URL pathname manually to determine specific route

### 2. Middleware Chain

Express middleware chain doesn't exist. Each function is independent:

**Express:**
```javascript
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
```

**Cloudflare:**
- Use `_headers` file for headers
- Handle CORS in each function
- Parse JSON manually: `await request.json()`

### 3. Session Management

Express sessions don't work. Use:
- Cloudflare KV for session storage
- JWT tokens for authentication
- Cloudflare Durable Objects for stateful logic

## Migration Checklist

- [x] ✅ Create Cloudflare account
- [x] ✅ Install Wrangler CLI
- [x] ✅ Convert Express routes to Functions
- [x] ✅ Convert MySQL schema to SQLite
- [x] ✅ Update SQL queries for D1 compatibility
- [x] ✅ Replace Nodemailer with Mailchannels
- [x] ✅ Create wrangler.toml configuration
- [x] ✅ Create D1 database
- [x] ✅ Update environment variables
- [x] ✅ Test locally with `wrangler pages dev`
- [x] ✅ Deploy to Cloudflare Pages
- [x] ✅ Configure production environment
- [x] ✅ Test all API endpoints
- [x] ✅ Test contact form emails
- [x] ✅ Migrate production data
- [x] ✅ Update DNS (if using custom domain)

## Benefits of Migration

### Performance
- ⚡ **Global CDN** - Site loads fast worldwide
- ⚡ **Edge computing** - Functions run close to users
- ⚡ **No cold starts** - Faster than traditional serverless

### Cost
- 💰 **Free tier** - Most churches stay within free limits
- 💰 **No server costs** - No VPS or hosting fees
- 💰 **No database costs** - D1 included free

### Scalability
- 📈 **Auto-scaling** - Handles traffic spikes automatically
- 📈 **Unlimited bandwidth** - No bandwidth charges
- 📈 **Global reach** - 275+ data centers worldwide

### Maintenance
- 🔧 **No server updates** - Cloudflare manages infrastructure
- 🔧 **No database backups** - D1 has automatic backups
- 🔧 **No SSL renewal** - Automatic HTTPS

### Developer Experience
- 👨‍💻 **Git-based deployment** - Push to deploy
- 👨‍💻 **Preview deployments** - Every PR gets preview URL
- 👨‍💻 **Instant rollbacks** - One-click rollback to any version

## Troubleshooting Common Issues

### "D1 binding not found"
**Solution**: Check `wrangler.toml` has correct database ID and binding name is "DB"

### "Module not found"
**Solution**: Use ES6 imports (`import/export`) not CommonJS (`require/module.exports`)

### "SQL syntax error"
**Solution**: Check for MySQL-specific syntax. Convert to SQLite-compatible SQL.

### "Email not sending"
**Solution**: 
1. Verify environment variables in Cloudflare Dashboard
2. Check Mailchannels API response in function logs
3. Consider using alternative email service

### "CORS errors"
**Solution**:
1. Verify `_headers` file is deployed
2. Check each function handles OPTIONS requests
3. Ensure CORS headers are set correctly

## Rollback Plan

If you need to rollback to Express/MySQL:

1. The original Express code is still in the repository
2. Switch to the `legacy` branch (if you created one)
3. Or use git to checkout previous commit
4. Deploy to traditional hosting
5. Restore MySQL database from backup

## Next Steps

1. **Monitor Performance** - Use Cloudflare Analytics
2. **Optimize Queries** - Add indexes to D1 tables
3. **Add Caching** - Use Cache API for frequently accessed data
4. **Set Up Alerts** - Configure Cloudflare alerts for errors
5. **Document Changes** - Update team documentation

## Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Mailchannels Docs](https://mailchannels.com/docs/)

## Questions?

Refer to [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) for detailed setup instructions.
