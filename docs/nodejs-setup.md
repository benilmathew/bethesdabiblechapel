# Node.js Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd Bethesda
npm install
```

This will install:
- **express**: Web framework
- **mysql2**: MySQL database driver
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variables
- **nodemailer**: Email sending
- **express-validator**: Request validation
- **helmet**: Security headers
- **compression**: Response compression
- **nodemon**: Development auto-reload (dev dependency)

### 2. Configure Environment

Copy the example environment file:
```bash
copy .env.example .env
```

Edit `.env` file with your actual configuration:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=bethesda_church

SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CONTACT_EMAIL=bethesdabiblechapel@gmail.com
```

### 3. Setup Database

Run the SQL script to create the database:
```bash
mysql -u root -p < api/database.sql
```

Or manually:
1. Open MySQL Workbench or phpMyAdmin
2. Create database: `bethesda_church`
3. Import `api/database.sql`

### 4. Start the Server

**Development mode (auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start at: http://localhost:3000

## API Endpoints

### Sermons

- `GET /api/sermons` - Get all sermons (with pagination)
  - Query params: `page`, `limit`, `series`, `speaker`
- `GET /api/sermons/:id` - Get single sermon
- `GET /api/sermons/featured/latest` - Get latest sermon
- `GET /api/sermons/series/list` - Get all sermon series
- `GET /api/sermons/speakers/list` - Get all speakers

**Example:**
```javascript
fetch('/api/sermons?page=1&limit=10')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Events

- `GET /api/events` - Get all events
  - Query params: `type` (upcoming/past/all), `category`
- `GET /api/events/:id` - Get single event
- `GET /api/events/categories/list` - Get all categories
- `GET /api/events/upcoming/featured` - Get next 3 events

**Example:**
```javascript
fetch('/api/events?type=upcoming')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Contact

- `POST /api/contact` - Submit contact form
  - Body: `{ name, email, phone?, subject?, message }`
- `POST /api/contact/newsletter` - Subscribe to newsletter
  - Body: `{ email, firstName?, lastName? }`

**Example:**
```javascript
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Ministries

- `GET /api/ministries` - Get all ministries
  - Query params: `status` (active/inactive)
- `GET /api/ministries/:id` - Get single ministry

### Health Check

- `GET /api/health` - Check server status

## Email Configuration

### Using Gmail

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `.env` as `SMTP_PASSWORD`

### Using Other Email Services

Update `.env` with your provider's settings:

**Outlook/Office365:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=465
SMTP_SECURE=true
```

## Database Connection

The app uses MySQL connection pooling for better performance. Configuration in `api/database.js`:

```javascript
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
});
```

## Project Structure

```
Bethesda/
├── server.js              # Express server
├── package.json           # Dependencies
├── .env                   # Environment variables
├── api/
│   ├── database.js       # Database connection & utilities
│   ├── database.sql      # Database schema
│   ├── sermons.js        # Sermons API routes
│   ├── events.js         # Events API routes
│   ├── contact.js        # Contact form handler
│   └── ministries.js     # Ministries API routes
├── assets/               # Static files (CSS, JS, images)
├── pages/                # HTML pages
└── index.html            # Homepage
```

## Development Workflow

### 1. Make Changes
Edit files in your preferred editor

### 2. Test Locally
```bash
npm run dev
```

### 3. Check Logs
Server logs appear in the console

### 4. Test API Endpoints
Use browser, Postman, or curl:
```bash
curl http://localhost:3000/api/health
```

## Deployment

### Heroku

1. Create `Procfile`:
```
web: node server.js
```

2. Deploy:
```bash
heroku create bethesda-church
heroku config:set NODE_ENV=production
git push heroku main
```

### DigitalOcean / VPS

1. Install Node.js and MySQL
2. Clone repository
3. Install dependencies: `npm install --production`
4. Setup PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### Vercel / Netlify

These platforms work great for static sites. For full backend:
- Use Vercel Functions for serverless
- Or deploy backend separately

## Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is running
# Windows:
net start MySQL80

# Verify credentials in .env file
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

### Email Not Sending
- Verify SMTP credentials
- Check spam folder
- Enable "Less secure apps" (Gmail)
- Use App Password instead of account password

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## Security Best Practices

1. **Never commit `.env` file** - Already in .gitignore
2. **Use HTTPS in production** - Configure SSL certificate
3. **Validate all inputs** - Using express-validator
4. **Use helmet for security headers** - Already configured
5. **Keep dependencies updated**:
```bash
npm audit
npm update
```

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Configure `.env` file
3. ✅ Setup MySQL database
4. ✅ Start server (`npm run dev`)
5. ✅ Test API endpoints
6. 🔄 Integrate API calls in frontend JavaScript
7. 🔄 Deploy to production

## Support

- Check `docs/deployment.md` for deployment guides
- See `README.md` for general information
- Review `api/database.sql` for database schema

---

**Your Node.js backend is ready! 🚀**
