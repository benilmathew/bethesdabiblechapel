# Deploying to Netlify

This guide will help you deploy the Bethesda Bible Chapel website to Netlify.

## Prerequisites

- GitHub account
- Netlify account (free - sign up at [netlify.com](https://www.netlify.com))
- Git installed on your computer

## Method 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub

1. **Initialize Git repository** (if not already done):
```bash
cd C:\Users\benil\OneDrive\Documents\Code\Bethesda
git init
git add .
git commit -m "Initial commit - Bethesda Bible Chapel website"
```

2. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name it `bethesda-bible-chapel` or similar
   - Don't initialize with README (you already have files)
   - Click "Create repository"

3. **Connect and push**:
```bash
git remote add origin https://github.com/YOUR-USERNAME/bethesda-bible-chapel.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Netlify

1. **Log in to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"

2. **Connect to GitHub**:
   - Select "GitHub"
   - Authorize Netlify to access your repositories
   - Choose your `bethesda-bible-chapel` repository

3. **Configure build settings**:
   ```
   Build command: (leave empty or use "echo 'Static site'")
   Publish directory: .
   ```

4. **Click "Deploy site"**

Your site will be live in a few seconds at a URL like `https://random-name-123456.netlify.app`

### Step 3: Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to connect your domain

## Method 2: Drag & Drop Deploy

### Quick Deploy Without Git

1. **Create a deployment folder**:
```powershell
cd C:\Users\benil\OneDrive\Documents\Code\Bethesda

# Create a clean copy (exclude node_modules, etc.)
$exclude = @('node_modules', '.git', '.env', 'api', 'server.js', 'dev-server.js', 'package.json', 'package-lock.json', '.vscode')
```

2. **Drag & drop to Netlify**:
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag your entire `Bethesda` folder (without node_modules)
   - Netlify will deploy instantly!

⚠️ **Note**: This method doesn't auto-update when you make changes.

## Method 3: Netlify CLI

### Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Deploy

```bash
cd C:\Users\benil\OneDrive\Documents\Code\Bethesda

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

## Configuration Details

### netlify.toml (Already Created)

Your `netlify.toml` file is configured with:
- Publish directory: `.` (root)
- Security headers
- Cache optimization
- Redirect rules

### Environment Variables

If you plan to use the backend features later:

1. In Netlify dashboard, go to "Site settings" → "Environment variables"
2. Add your variables:
   ```
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```

## Post-Deployment

### What Works Automatically

✅ **Header & Footer Components** - Load correctly via HTTP  
✅ **All Pages** - Accessible and working  
✅ **Mobile Responsive** - Works on all devices  
✅ **HTTPS** - Automatic SSL certificate  
✅ **CDN** - Fast loading worldwide  

### Custom Domain Setup

1. **Buy a domain** (e.g., GoDaddy, Namecheap)
2. **In Netlify**:
   - Domain settings → Add custom domain
   - Enter your domain (e.g., `bethesdabiblechapel.org`)
3. **In your domain registrar**:
   - Add DNS records Netlify provides
   - Wait 24-48 hours for propagation

Example DNS records:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME  
Name: www
Value: your-site.netlify.app
```

## Continuous Deployment

Once connected to GitHub, any push to your main branch will auto-deploy:

```bash
# Make changes to your site
# ... edit files ...

# Commit and push
git add .
git commit -m "Update content"
git push

# Netlify automatically rebuilds and deploys!
```

## Build & Deploy Status

### Check Deployment

- Visit your Netlify dashboard
- See real-time build logs
- Preview deploys before going live

### Deploy Previews

- Every pull request gets its own preview URL
- Test changes before merging

## Troubleshooting

### Components Not Loading

**Issue**: Header/footer not showing  
**Solution**: Already fixed! Components use relative paths that work on Netlify.

### 404 Errors

**Issue**: Pages not found  
**Solution**: Check that all files are committed to Git and paths use `/` not `\`

### Build Fails

**Issue**: Netlify build errors  
**Solution**: For static sites, use empty build command or `echo 'Static site'`

## Performance Optimization

### Already Configured

✅ Gzip compression  
✅ Asset caching (31536000 seconds)  
✅ HTML no-cache (always fresh)  
✅ CDN delivery  

### Additional Tips

1. **Optimize images** - Compress before uploading
2. **Minify CSS/JS** - Use build tools (optional)
3. **Use WebP images** - Better compression

## Cost

**Free Tier Includes**:
- 100 GB bandwidth/month
- 300 build minutes/month
- Automatic SSL
- CDN
- Deploy previews

**Perfect for church websites!** 🎉

## Netlify Features You Can Use

### Forms (Contact Page)

Add to your contact form:
```html
<form name="contact" method="POST" data-netlify="true">
  <!-- your form fields -->
</form>
```

Netlify automatically handles form submissions!

### Functions (Serverless)

Add serverless functions in `netlify/functions/`:
```javascript
// netlify/functions/hello.js
exports.handler = async function() {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello!" })
  };
};
```

### Analytics

- Enable in Netlify dashboard
- Track visitors (paid feature)

## Deployment Checklist

Before deploying:

- [ ] Test locally (`npm run serve`)
- [ ] Check all pages load
- [ ] Verify mobile responsiveness
- [ ] Update contact information
- [ ] Add real content
- [ ] Replace placeholder images
- [ ] Test all links
- [ ] Commit all changes to Git
- [ ] Push to GitHub
- [ ] Connect to Netlify
- [ ] Verify live site
- [ ] Configure custom domain (optional)

## Quick Reference

```bash
# Local development
npm run serve

# Git workflow
git add .
git commit -m "Your message"
git push

# Netlify CLI
netlify deploy --prod

# Check status
netlify status

# Open dashboard
netlify open
```

## Support

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Netlify Support**: [support.netlify.com](https://support.netlify.com)
- **Community**: [answers.netlify.com](https://answers.netlify.com)

---

## Next Steps

1. Push your code to GitHub
2. Connect to Netlify
3. Get your live URL
4. Share with your congregation! 🎉

Your website will be live at: `https://your-site-name.netlify.app`
