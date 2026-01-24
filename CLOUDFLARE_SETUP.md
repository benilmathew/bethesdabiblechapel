# Cloudflare Pages Setup Guide

This guide will walk you through deploying the Bethesda Bible Chapel website to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com) (free tier works)
2. **GitHub Account** - Your code should be in a GitHub repository
3. **Wrangler CLI** - Install globally: `npm install -g wrangler`

## Step 1: Set Up Cloudflare D1 Database

### 1.1 Create D1 Database

```bash
# Login to Cloudflare
wrangler login

# Create production database
wrangler d1 create bethesda_church
```

This will output a database ID. **Save this ID** - you'll need it later.

Example output:
```
✅ Successfully created DB 'bethesda_church'

[[d1_databases]]
binding = "DB"
database_name = "bethesda_church"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 1.2 Update wrangler.toml

Edit `wrangler.toml` and replace `your-database-id-here` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "bethesda_church"
database_id = "your-actual-database-id-here"  # Replace this
```

**Note:** The repository includes a `.wranglerignore` file that excludes `node_modules/` and other unnecessary files from deployment. This prevents the "Asset too large" error by ensuring only essential files are uploaded to Cloudflare Pages.

### 1.3 Initialize Database Schema

```bash
# Run migration to create tables
wrangler d1 execute bethesda_church --remote --file=./schema.sql
```

### 1.4 (Optional) Add Sample Data

If you want to test with sample data, uncomment the INSERT statements at the bottom of `schema.sql` and run the migration again.

## Step 2: Create Cloudflare Pages Project

### Option A: Using Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Workers & Pages** in the left sidebar
3. Click **Create application** → **Pages** → **Connect to Git**
4. Select your GitHub repository (`bethesdabiblechapel`)
5. Configure build settings:
   - **Production branch**: `main` (or your default branch)
   - **Build command**: Leave empty (static site)
   - **Build output directory**: `/`
   - **Root directory**: `/` (project root)
6. Click **Save and Deploy**

### Option B: Using Wrangler CLI

```bash
# Deploy from command line (use 'pages deploy', NOT 'versions upload')
wrangler pages deploy . --project-name=bethesdabiblechapel

# First deployment will create the project
```

**Important:** Use `wrangler pages deploy` for Cloudflare Pages projects. Do NOT use `wrangler versions upload` (that's for Workers v2, not Pages).

## Step 3: Connect D1 Database to Pages

### 3.1 Via Dashboard

1. Go to your Pages project in Cloudflare Dashboard
2. Click **Settings** → **Functions**
3. Scroll to **D1 database bindings**
4. Click **Add binding**:
   - **Variable name**: `DB`
   - **D1 database**: Select `bethesda_church`
5. Click **Save**

### 3.2 Via Wrangler

The D1 binding is already configured in `wrangler.toml`, so it should work automatically when you deploy with `wrangler pages deploy`.

## Step 4: Configure Environment Variables

### 4.1 Set Production Environment Variables

1. Go to your Pages project → **Settings** → **Environment variables**
2. Add the following variables for **Production**:

```
FROM_EMAIL=noreply@bethesdabiblechapel.org
FROM_NAME=Bethesda Bible Chapel
CONTACT_EMAIL=bethesdabiblechapel@gmail.com
SITE_NAME=Bethesda Bible Chapel
SITE_URL=https://bethesdabiblechapel.pages.dev
```

3. Click **Save**

### 4.2 (Optional) Set Preview Environment Variables

Repeat the same for **Preview** deployments if you want different settings for preview branches.

## Step 5: Verify Email Configuration

The contact form uses **Mailchannels** which is free with Cloudflare Workers. However, you need to verify your domain:

### 5.1 Add SPF Record (if using custom domain)

If you're using a custom domain, add this SPF record to your DNS:

```
Type: TXT
Name: @
Value: v=spf1 a mx include:relay.mailchannels.net ~all
```

### 5.2 Add DKIM Record (optional but recommended)

Contact Mailchannels support to set up DKIM for better email deliverability.

### 5.3 Alternative: Use External Email Service

If Mailchannels doesn't work for you, you can use:
- **SendGrid** - Update `functions/api/contact.js` to use SendGrid API
- **Mailgun** - Update to use Mailgun API
- **AWS SES** - Update to use SES API

## Step 6: Test Your Deployment

### 6.1 Check Deployment Status

Your site should be live at: `https://bethesdabiblechapel.pages.dev`

### 6.2 Test API Endpoints

```bash
# Test health check
curl https://bethesdabiblechapel.pages.dev/api/health

# Test sermons API
curl https://bethesdabiblechapel.pages.dev/api/sermons

# Test events API
curl https://bethesdabiblechapel.pages.dev/api/events
```

### 6.3 Test Contact Form

1. Visit your website
2. Fill out the contact form
3. Submit and verify:
   - Form submission succeeds
   - Email is sent to `CONTACT_EMAIL`
   - Confirmation email is sent to submitter

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain

1. Go to your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `bethesdabiblechapel.org`)
4. Follow the instructions to add DNS records

### 7.2 Update Environment Variables

Update `SITE_URL` in environment variables to your custom domain:

```
SITE_URL=https://bethesdabiblechapel.org
```

## Step 8: Populate Database

Now that everything is deployed, you need to add content to your database.

### Option A: Manual SQL Inserts

```bash
# Create a file with your data: data.sql
# Then run:
wrangler d1 execute bethesda_church --remote --file=./data.sql
```

Example `data.sql`:
```sql
-- Add sermons
INSERT INTO sermons (title, speaker, date, description, series) VALUES
('The Power of Prayer', 'Pastor John Smith', '2024-01-15', 'Exploring prayer', 'Prayer Series'),
('Walking in Faith', 'Pastor Jane Doe', '2024-01-08', 'Understanding faith', 'Faith Series');

-- Add events
INSERT INTO events (title, description, date, start_time, end_time, location, category) VALUES
('Sunday Service', 'Weekly worship', '2024-02-04', '10:00', '11:30', 'Main Sanctuary', 'worship'),
('Bible Study', 'Midweek study', '2024-02-07', '19:00', '20:30', 'Fellowship Hall', 'study');

-- Add ministries
INSERT INTO ministries (name, description, leader, status) VALUES
('Youth Ministry', 'For teenagers', 'John Doe', 'active'),
('Children''s Ministry', 'Sunday school', 'Jane Smith', 'active');
```

### Option B: Create an Admin Panel (Future Enhancement)

Consider building a simple admin panel to manage content through a web interface.

## Local Development After Setup

Once everything is set up in production, you can develop locally:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd bethesdabiblechapel

# 2. Install dependencies
npm install

# 3. Create local D1 database
wrangler d1 create bethesda_church
wrangler d1 execute bethesda_church --local --file=./schema.sql

# 4. Set up environment variables
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your settings

# 5. Start development server
npm run dev

# Site will be available at http://localhost:8788
```

## Troubleshooting

### Issue: D1 Database Not Found

**Error**: `Error: D1 binding DB not found`

**Solution**: Make sure you've:
1. Created the D1 database
2. Added the binding in Pages settings
3. Updated `wrangler.toml` with correct database ID
4. Redeployed after making changes

### Issue: Emails Not Sending

**Error**: Contact form submits but no emails received

**Solutions**:
1. Check Cloudflare Pages logs for email errors
2. Verify environment variables are set correctly
3. Check spam folder
4. If using custom domain, verify SPF records
5. Consider using an alternative email service

### Issue: API Endpoints Return 404

**Error**: `/api/sermons` returns 404

**Solutions**:
1. Make sure `functions/` directory is in the root
2. Check that function files are named correctly
3. Verify deployment included the `functions/` directory
4. Check Cloudflare Pages logs for function errors

### Issue: CORS Errors

**Error**: Browser shows CORS errors when calling APIs

**Solutions**:
1. The `_headers` file should handle CORS
2. Each function also sets CORS headers
3. Make sure `_headers` file is in the root directory
4. Check that it was deployed

### Issue: Build Fails

**Error**: Deployment build fails

**Solutions**:
1. Make sure `.node-version` file exists with `20` (Wrangler 4.x requires Node 20+)
2. Check that `package.json` is valid
3. Review build logs in Cloudflare Dashboard
4. Try deploying with `wrangler pages deploy .`

## Monitoring and Logs

### View Logs

1. Go to Cloudflare Dashboard
2. Click on your Pages project
3. Go to **Functions** → **Logs**
4. View real-time logs of function executions

### Analytics

1. Enable Cloudflare Web Analytics in your project settings
2. View visitor analytics in the Dashboard
3. Monitor API usage in **Workers & Pages Analytics**

## Updating Your Site

### Continuous Deployment

Once connected to GitHub, any push to your production branch automatically triggers a new deployment:

```bash
# Make changes
git add .
git commit -m "Update content"
git push origin main

# Cloudflare Pages automatically deploys
```

### Manual Deployment

```bash
# Deploy from local machine
wrangler pages deploy .
```

### Database Migrations

```bash
# Run new migrations
wrangler d1 execute bethesda_church --remote --file=./migration.sql
```

## Security Best Practices

1. **Environment Variables**: Never commit `.dev.vars` or `.env` files
2. **Database**: D1 is automatically secured by Cloudflare
3. **Email**: Use environment variables for email credentials
4. **HTTPS**: Cloudflare provides free SSL certificates
5. **Headers**: Security headers are configured in `_headers` file
6. **Input Validation**: All API endpoints validate input

## Cost Considerations

### Cloudflare Pages Free Tier Includes:
- Unlimited bandwidth
- Unlimited requests
- 500 builds per month
- 20,000 Files per deployment
- 100 custom domains

### Cloudflare D1 Free Tier Includes:
- 5 GB storage
- 5 million reads per day
- 100,000 writes per day

### When You Might Need to Upgrade:
- High traffic (>100k visitors/month)
- Large database (>5GB)
- Many database writes (>100k/day)

For a typical church website, the free tier should be more than sufficient.

## Next Steps

1. **Add Content**: Populate your database with sermons, events, and ministries
2. **Customize Design**: Update colors, fonts, and layouts in `assets/css/`
3. **Add Images**: Upload church photos to `assets/images/`
4. **Configure Analytics**: Set up Cloudflare Web Analytics
5. **Custom Domain**: Point your church domain to Cloudflare Pages
6. **Email Setup**: Configure SPF/DKIM for better deliverability
7. **Backup Plan**: Set up regular D1 database exports

## Support and Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Mailchannels Documentation](https://mailchannels.com/docs/)

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review Cloudflare Pages logs
3. Check the [Cloudflare Community](https://community.cloudflare.com/)
4. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/cloudflare-pages)

---

**Congratulations!** Your church website is now deployed on Cloudflare Pages! 🎉
