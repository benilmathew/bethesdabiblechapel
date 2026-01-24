# Bethesda Bible Chapel Website

A modern, responsive church website built with HTML, CSS, and JavaScript, powered by Cloudflare Pages and D1 database.

## 🚀 Deployment

This website is designed to be deployed on **Cloudflare Pages** with:
- **Cloudflare D1** for serverless database
- **Cloudflare Functions** for API endpoints
- **Mailchannels** for email functionality
- **Static file serving** via Cloudflare CDN

For detailed deployment instructions, see [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md)

## Local Development Setup

### Prerequisites

- Node.js 18 or higher
- Wrangler CLI (`npm install -g wrangler`)
- A Cloudflare account (free tier works)

### Steps to Run Locally

1. **Clone the repository:**
```bash
git clone <repository-url>
cd bethesdabiblechapel
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your email configuration.

4. **Set up Cloudflare D1 database (local):**
```bash
# Create a local D1 database for development
wrangler d1 create bethesda_church

# Initialize the database with schema
wrangler d1 execute DB --local --file=./schema.sql
```

5. **Start the development server:**
```bash
npm run dev
```

6. **Open your browser and visit:**
```
http://localhost:8788
```

### Alternative: Legacy Node.js Server

If you want to use the original Express server (requires MySQL):

```bash
# Install MySQL and set up database
mysql -u root -p < api/database.sql

# Copy environment file
cp .env.example .env

# Edit .env with your settings
# Then start the server
npm run dev:legacy
```

## Project Structure

```
bethesdabiblechapel/
├── index.html              # Homepage
├── wrangler.toml           # Cloudflare Pages configuration
├── schema.sql              # D1 database schema
├── _headers                # Custom HTTP headers
├── _redirects              # URL redirects
├── .node-version           # Node.js version for deployment
├── .dev.vars.example       # Environment variables template
│
├── functions/              # Cloudflare Functions (API)
│   ├── api/
│   │   ├── sermons.js      # Sermons API endpoint
│   │   ├── events.js       # Events API endpoint
│   │   ├── contact.js      # Contact form handler
│   │   ├── ministries.js   # Ministries API endpoint
│   │   └── health.js       # Health check endpoint
│   └── utils/
│       └── database.js     # D1 database utilities
│
├── api/                    # Legacy Express API (for reference)
│   ├── database.js
│   ├── database.sql
│   ├── sermons.js
│   ├── events.js
│   ├── contact.js
│   └── ministries.js
│
├── assets/
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   │   ├── main.js
│   │   ├── utils.js
│   │   └── api-integration.js
│   └── images/             # Images and icons
│
├── pages/                  # Internal pages
├── components/             # Reusable header and footer
├── server.js               # Legacy Express server
├── dev-server.js           # Simple development server
└── package.json            # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start Cloudflare Pages development server
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run db:init` - Initialize D1 database (local)
- `npm run db:migrate` - Migrate D1 database (production)
- `npm run dev:legacy` - Start legacy Express server
- `npm run serve` - Start simple static file server

## Features

### Frontend
- ✅ Modern, responsive design
- ✅ Works on desktop, tablet, and mobile devices
- ✅ Professional navigation with dropdowns
- ✅ Hero section with call-to-action buttons
- ✅ Dynamic sermons, events, ministries sections
- ✅ Contact form with validation
- ✅ Newsletter subscription
- ✅ Smooth animations and transitions

### Backend (Cloudflare Functions)
- ✅ Serverless API endpoints
- ✅ D1 SQLite database
- ✅ Email functionality via Mailchannels
- ✅ RESTful APIs for sermons, events, contact forms
- ✅ Input validation and security
- ✅ CORS enabled for cross-origin requests
- ✅ Automatic scaling with Cloudflare Workers

## API Endpoints

All API endpoints are serverless Cloudflare Functions:

- `GET /api/sermons` - Get all sermons (with pagination)
- `GET /api/sermons/:id` - Get single sermon
- `GET /api/sermons/featured/latest` - Get latest sermon
- `GET /api/sermons/series/list` - Get all sermon series
- `GET /api/sermons/speakers/list` - Get all speakers
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `GET /api/events/upcoming/featured` - Get upcoming events
- `GET /api/events/categories/list` - Get event categories
- `GET /api/ministries` - Get all ministries
- `GET /api/ministries/:id` - Get single ministry
- `POST /api/contact` - Submit contact form
- `POST /api/contact/newsletter` - Subscribe to newsletter
- `GET /api/health` - Health check

## Database Schema

The website uses Cloudflare D1 (SQLite) with the following tables:

- `sermons` - Sermon recordings and metadata
- `events` - Church events and activities
- `ministries` - Ministry information
- `contact_submissions` - Contact form submissions
- `newsletter_subscribers` - Newsletter subscriptions

See [schema.sql](schema.sql) for the complete schema.

## Deployment

For detailed deployment instructions to Cloudflare Pages, see:
- [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) - Step-by-step Cloudflare setup
- [START_HERE.md](START_HERE.md) - Quick start guide

## Environment Variables

Required environment variables for Cloudflare Pages:

- `FROM_EMAIL` - Sender email address
- `FROM_NAME` - Sender name
- `CONTACT_EMAIL` - Email to receive contact form submissions
- `SITE_NAME` - Church name
- `SITE_URL` - Website URL

See `.dev.vars.example` for all available variables.

## Contributing

This is a church website. For changes or suggestions, please contact the church administrator.

## License

MIT

