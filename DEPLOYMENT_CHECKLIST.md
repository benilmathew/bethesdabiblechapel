# Cloudflare Pages Deployment Checklist

Use this checklist to deploy your Bethesda Bible Chapel website to Cloudflare Pages.

## Pre-Deployment Checklist

### Account Setup
- [ ] Create Cloudflare account at https://cloudflare.com
- [ ] Install Wrangler CLI: `npm install -g wrangler`
- [ ] Login to Cloudflare: `wrangler login`

### Local Testing
- [ ] Install dependencies: `npm install`
- [ ] Copy environment file: `cp .dev.vars.example .dev.vars`
- [ ] Edit `.dev.vars` with your email settings
- [ ] Create local D1 database: `wrangler d1 create bethesda_church`
- [ ] Initialize database: `wrangler d1 execute bethesda_church --local --file=./schema.sql`
- [ ] Test locally: `npm run dev`
- [ ] Verify site works at http://localhost:8788
- [ ] Test all API endpoints work
- [ ] Test contact form (emails may not send locally)

## Deployment Steps

### 1. Create Production D1 Database
```bash
# Create database
wrangler d1 create bethesda_church

# Note the database ID from output
# Example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

- [ ] Database created
- [ ] Database ID saved: `___________________________`

### 2. Update Configuration

Edit `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "bethesda_church"
database_id = "your-actual-database-id-here"  # Replace with your ID
```

- [ ] Updated `wrangler.toml` with database ID
- [ ] Committed changes to git

### 3. Initialize Production Database

```bash
# Run schema migration
wrangler d1 execute bethesda_church --remote --file=./schema.sql
```

- [ ] Database schema created
- [ ] Verified tables exist: `wrangler d1 execute bethesda_church --remote --command="SELECT name FROM sqlite_master WHERE type='table';"`

### 4. Deploy to Cloudflare Pages

#### Option A: GitHub Integration (Recommended)
1. Push code to GitHub
2. Go to Cloudflare Dashboard → Workers & Pages
3. Click "Create application" → "Pages" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`
6. Click "Save and Deploy"

- [ ] Connected GitHub repository
- [ ] Configured build settings
- [ ] Initial deployment successful
- [ ] Site URL: `https://bethesdabiblechapel.pages.dev`

#### Option B: Direct Deploy with Wrangler
```bash
wrangler pages deploy . --project-name=bethesdabiblechapel
```

- [ ] Deployed with Wrangler
- [ ] Deployment successful
- [ ] Site URL: `_____________________________`

### 5. Configure D1 Binding in Pages

1. Go to Cloudflare Dashboard
2. Select your Pages project
3. Go to Settings → Functions
4. Scroll to "D1 database bindings"
5. Add binding:
   - Variable name: `DB`
   - D1 database: Select `bethesda_church`
6. Click "Save"

- [ ] D1 binding configured
- [ ] Redeployed after adding binding

### 6. Set Environment Variables

Go to Settings → Environment variables and add:

**Production:**
- [ ] `FROM_EMAIL` = `noreply@bethesdabiblechapel.org`
- [ ] `FROM_NAME` = `Bethesda Bible Chapel`
- [ ] `CONTACT_EMAIL` = `bethesdabiblechapel@gmail.com`
- [ ] `SITE_NAME` = `Bethesda Bible Chapel`
- [ ] `SITE_URL` = `https://bethesdabiblechapel.pages.dev`

**Preview (optional):**
- [ ] Set same variables for preview deployments

- [ ] Redeployed after adding variables

### 7. Populate Database

Create a file `data.sql` with your content:
```sql
-- Add sample sermon
INSERT INTO sermons (title, speaker, date, description, series, status) 
VALUES ('Welcome to Our Church', 'Pastor Smith', '2024-01-21', 'A warm welcome message', 'Getting Started', 'published');

-- Add sample event
INSERT INTO events (title, description, date, start_time, end_time, location, category, status)
VALUES ('Sunday Service', 'Join us for worship', '2024-02-04', '10:00', '11:30', 'Main Sanctuary', 'worship', 'published');

-- Add sample ministry
INSERT INTO ministries (name, description, leader, status)
VALUES ('Youth Ministry', 'Ministry for young people', 'John Doe', 'active');
```

Deploy data:
```bash
wrangler d1 execute bethesda_church --remote --file=./data.sql
```

- [ ] Created `data.sql` with content
- [ ] Deployed data to production database
- [ ] Verified data appears on website

## Post-Deployment Testing

### Basic Functionality
- [ ] Visit your site: `https://bethesdabiblechapel.pages.dev`
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] All pages accessible
- [ ] Images load properly
- [ ] CSS styles applied

### API Endpoints
Test each endpoint (use browser or curl):

- [ ] Health check: `/api/health`
  ```bash
  curl https://bethesdabiblechapel.pages.dev/api/health
  ```

- [ ] Sermons list: `/api/sermons`
  ```bash
  curl https://bethesdabiblechapel.pages.dev/api/sermons
  ```

- [ ] Events list: `/api/events`
  ```bash
  curl https://bethesdabiblechapel.pages.dev/api/events
  ```

- [ ] Ministries list: `/api/ministries`
  ```bash
  curl https://bethesdabiblechapel.pages.dev/api/ministries
  ```

### Contact Form
- [ ] Fill out contact form on website
- [ ] Submit form
- [ ] Check for success message
- [ ] Verify email received at `CONTACT_EMAIL`
- [ ] Verify confirmation email sent to submitter
- [ ] Check spam folder if emails not received

### Newsletter
- [ ] Test newsletter subscription
- [ ] Submit email
- [ ] Check for success message
- [ ] Verify welcome email received

### Database Operations
- [ ] Sermons display on frontend
- [ ] Events display on frontend
- [ ] Ministries display on frontend
- [ ] View counts increment when viewing sermons

## Custom Domain (Optional)

### Add Custom Domain
1. Go to Pages project → Custom domains
2. Click "Set up a custom domain"
3. Enter domain: `bethesdabiblechapel.org`
4. Follow DNS instructions to add records
5. Wait for DNS propagation (can take 24-48 hours)

- [ ] Added custom domain
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Domain accessible via HTTPS

### Update Configuration
- [ ] Update `SITE_URL` in environment variables to custom domain
- [ ] Update any hardcoded URLs in content
- [ ] Test site on custom domain

## Email Setup (Optional)

### Mailchannels Domain Verification
For better deliverability with custom domain:

1. Add SPF record:
   - Type: `TXT`
   - Name: `@`
   - Value: `v=spf1 a mx include:relay.mailchannels.net ~all`

2. Contact Mailchannels for DKIM setup

- [ ] SPF record added
- [ ] DKIM configured (optional)
- [ ] Test email delivery

### Alternative Email Service
If Mailchannels doesn't work:

- [ ] Sign up for SendGrid/Mailgun/AWS SES
- [ ] Get API key
- [ ] Update `functions/api/contact.js` to use new service
- [ ] Add API key to environment variables
- [ ] Test email sending

## Monitoring & Analytics

### Cloudflare Analytics
- [ ] Enable Web Analytics in project settings
- [ ] Install analytics script on pages (optional)
- [ ] Review analytics dashboard

### Function Logs
- [ ] Access Functions → Logs in dashboard
- [ ] Verify no errors in logs
- [ ] Monitor API usage

### Set Up Alerts (Optional)
- [ ] Configure Cloudflare alerts for errors
- [ ] Set up email notifications
- [ ] Monitor uptime

## Performance Optimization

### Caching
- [ ] Verify `_headers` file deployed correctly
- [ ] Check cache headers in browser DevTools
- [ ] Test page load speed with PageSpeed Insights

### Images
- [ ] Optimize images with TinyPNG or Squoosh
- [ ] Use appropriate image formats (WebP for modern browsers)
- [ ] Add proper alt text for accessibility

### Database
- [ ] Add indexes for frequently queried columns
- [ ] Monitor D1 usage in dashboard
- [ ] Optimize slow queries if needed

## Maintenance Tasks

### Regular Updates
- [ ] Set up automatic GitHub deployments
- [ ] Document update process for content
- [ ] Schedule regular database backups

### Content Management
- [ ] Create process for adding sermons
- [ ] Create process for adding events
- [ ] Document how to update ministries

### Backup Plan
- [ ] Document how to export D1 database
- [ ] Schedule regular database exports
- [ ] Store backups securely

## Troubleshooting

If something doesn't work, check:

### Deployment Issues
- [ ] Check build logs in Cloudflare Dashboard
- [ ] Verify all files committed to git
- [ ] Check Functions logs for errors

### API Issues
- [ ] Verify D1 binding configured correctly
- [ ] Check environment variables set
- [ ] Review function logs for errors
- [ ] Test with curl/Postman

### Email Issues
- [ ] Verify environment variables
- [ ] Check Mailchannels API response in logs
- [ ] Test with different email address
- [ ] Check spam folder

### Database Issues
- [ ] Verify database created and initialized
- [ ] Check binding name matches "DB"
- [ ] Review SQL syntax for D1 compatibility

## Success! 🎉

- [ ] Site is live and accessible
- [ ] All features working
- [ ] Contact form sending emails
- [ ] Database operations working
- [ ] Content displaying correctly
- [ ] Performance is good
- [ ] Team trained on updates
- [ ] Documentation complete

## Next Steps

Now that your site is deployed:

1. **Announce**: Share the new website with your congregation
2. **Content**: Continue adding sermons, events, and updates
3. **Engage**: Monitor analytics and user feedback
4. **Improve**: Continuously improve based on feedback
5. **Maintain**: Keep content fresh and up-to-date

---

**Congratulations!** Your church website is now live on Cloudflare Pages! 🚀

For help, see:
- [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) - Detailed setup guide
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Technical details
- [README.md](README.md) - Full documentation

---

## Quick Commands Reference

```bash
# Local Development
npm run dev                                           # Start local server
wrangler d1 execute bethesda_church --local           # Local D1 queries

# Database Management
wrangler d1 create bethesda_church                    # Create database
wrangler d1 execute DB --remote --file=schema.sql     # Run migrations
wrangler d1 execute DB --remote --command="SELECT * FROM sermons;" # Query

# Deployment
git push origin main                                  # Deploy (if GitHub connected)
wrangler pages deploy .                              # Manual deploy

# Logs & Monitoring
wrangler pages deployment tail                        # View real-time logs
wrangler pages deployments list                       # List deployments
```
