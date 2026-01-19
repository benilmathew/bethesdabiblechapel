# Deployment Guide

## Hosting Options

### 1. Netlify (Recommended for Static Sites)

#### Advantages
- Free SSL certificate
- Automatic deployments from Git
- Global CDN
- Easy custom domain setup
- Form handling included

#### Steps
1. Sign up at [netlify.com](https://www.netlify.com)
2. Click "New site from Git" or drag & drop folder
3. Connect your repository (optional)
4. Deploy!

#### Custom Domain
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Update DNS settings at your domain registrar
4. Netlify provides instructions

### 2. Vercel

#### Advantages
- Excellent performance
- Easy Git integration
- Free SSL
- Serverless functions support

#### Steps
1. Sign up at [vercel.com](https://vercel.com)
2. Import Git repository
3. Configure and deploy

### 3. GitHub Pages

#### Advantages
- Free hosting
- Integrated with GitHub
- Easy version control

#### Steps
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select source branch
4. Save

#### Custom Domain
1. Add CNAME file with your domain
2. Configure DNS at registrar
3. Enable HTTPS in settings

### 4. AWS S3 + CloudFront

#### Advantages
- Highly scalable
- Low cost
- Professional setup
- Full control

#### Steps
1. Create S3 bucket
2. Enable static website hosting
3. Upload files
4. Set bucket policy for public access
5. (Optional) Add CloudFront for CDN

### 5. Traditional Web Hosting

#### Examples
- Bluehost
- HostGator
- SiteGround
- GoDaddy

#### Steps
1. Purchase hosting plan
2. Get FTP credentials
3. Upload files via FTP client (FileZilla)
4. Point domain to hosting

## Pre-Deployment Checklist

### Content Review
- [ ] All placeholder text replaced
- [ ] Contact information updated
- [ ] Links tested and working
- [ ] Images optimized and uploaded
- [ ] Social media links updated

### Technical Review
- [ ] All pages load correctly
- [ ] Mobile responsiveness tested
- [ ] Forms tested (if applicable)
- [ ] 404 page created
- [ ] Favicon added
- [ ] Meta tags updated
- [ ] Analytics code added

### SEO Setup
- [ ] Page titles optimized
- [ ] Meta descriptions written
- [ ] Alt text for images
- [ ] sitemap.xml created
- [ ] robots.txt created
- [ ] Google Search Console setup
- [ ] Google Analytics setup

### Performance
- [ ] Images compressed
- [ ] CSS minified
- [ ] JavaScript minified
- [ ] Lazy loading implemented
- [ ] Page speed tested

## Post-Deployment

### 1. SSL Certificate
Ensure HTTPS is enabled (most modern hosts provide this free)

### 2. CDN Setup (Optional)
Consider Cloudflare for additional performance and security

### 3. Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor analytics
- Check performance regularly

### 4. Backups
- Regular backups of content
- Version control with Git
- Database backups (for dynamic version)

## Domain Configuration

### DNS Settings

#### For Netlify/Vercel
```
Type: A
Host: @
Value: [Provided IP]

Type: CNAME
Host: www
Value: [Your site URL]
```

#### For GitHub Pages
```
Type: A
Host: @
Value: 185.199.108.153
        185.199.109.153
        185.199.110.153
        185.199.111.153

Type: CNAME
Host: www
Value: [username].github.io
```

## Updating the Site

### Via Git
```bash
git add .
git commit -m "Update description"
git push
```
(Automatic deployment if connected to Netlify/Vercel)

### Via FTP
1. Connect to server
2. Upload modified files
3. Clear cache if needed

### Via Hosting Panel
1. Log in to control panel
2. Use file manager
3. Upload/edit files

## Troubleshooting

### Site Not Loading
- Check DNS propagation (up to 48 hours)
- Verify domain settings
- Check hosting account status

### Images Not Showing
- Verify file paths (case-sensitive on Linux servers)
- Check file permissions
- Ensure images uploaded to correct directory

### Form Not Working
- Verify form action URL
- Check email configuration
- Test form handler

### SSL Issues
- Wait for certificate provisioning
- Check DNS configuration
- Force HTTPS redirect

## Advanced: Converting to CMS

### WordPress Integration
1. Install WordPress
2. Choose church theme
3. Migrate content
4. Install necessary plugins

### Custom CMS
1. Choose backend (PHP/Node.js/Python)
2. Set up database
3. Create API endpoints
4. Implement admin panel

### Headless CMS Options
- Contentful
- Strapi
- Sanity
- Ghost

## Security Best Practices

- Keep software updated
- Use strong passwords
- Enable 2FA on hosting account
- Regular security audits
- Backup regularly
- Use HTTPS only
- Implement CSP headers

## Support

For deployment issues:
1. Check hosting provider documentation
2. Review error logs
3. Test locally first
4. Contact hosting support

---

Need help? Check the README.md or create an issue in the repository.
