# Custom Domain Setup for Netlify

## Quick Setup Guide

### Step 1: Add Domain to Netlify

1. **Go to your Netlify dashboard**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Select your `bethesdabiblechapel` site

2. **Navigate to Domain settings**:
   - Click "Domain settings" (or "Set up a custom domain")
   - Click "Add custom domain"

3. **Enter your domain**:
   - Type your domain (e.g., `bethesdabiblechapel.org` or `yourchurchname.com`)
   - Click "Verify"
   - If you own it, click "Yes, add domain"

### Step 2: Configure DNS Records

You have **two options** for DNS configuration:

## Option A: Use Netlify DNS (Recommended - Easiest)

This is the simplest option - Netlify manages everything!

### Steps:

1. **In Netlify Domain settings**:
   - Click "Set up Netlify DNS"
   - Netlify will show you nameservers like:
     ```
     dns1.p01.nsone.net
     dns2.p01.nsone.net
     dns3.p01.nsone.net
     dns4.p01.nsone.net
     ```

2. **Go to your domain registrar** (GoDaddy, Namecheap, Google Domains, etc.):
   - Find "Nameservers" or "DNS Management"
   - Choose "Custom nameservers"
   - Replace existing nameservers with Netlify's 4 nameservers
   - Save changes

3. **Wait for propagation** (15 minutes - 48 hours, usually under 1 hour)

4. **Netlify automatically configures**:
   - ✅ SSL certificate (HTTPS)
   - ✅ WWW redirect
   - ✅ DNS records

### Example: GoDaddy

```
1. Log in to GoDaddy
2. Go to "My Products" → "Domains"
3. Click on your domain
4. Scroll to "Additional Settings" → "Manage DNS"
5. Click "Change" under "Nameservers"
6. Select "Custom"
7. Enter Netlify's 4 nameservers
8. Save
```

### Example: Namecheap

```
1. Log in to Namecheap
2. Go to "Domain List"
3. Click "Manage" next to your domain
4. Find "Nameservers" section
5. Select "Custom DNS"
6. Enter Netlify's 4 nameservers
7. Save
```

---

## Option B: Keep Your Current DNS (Manual Setup)

If you want to keep your current nameservers (for email, etc.):

### For Apex Domain (bethesdabiblechapel.org)

Add these DNS records in your domain registrar:

**Record 1 - A Record:**
```
Type:  A
Name:  @ (or leave blank)
Value: 75.2.60.5
TTL:   3600 (or automatic)
```

**Optional - Additional A Records for redundancy:**
```
Type:  A
Name:  @
Value: 99.83.190.102
```

```
Type:  A
Name:  @
Value: 13.224.34.217
```

```
Type:  A
Name:  @
Value: 52.222.158.154
```

### For WWW Subdomain (www.bethesdabiblechapel.org)

**Record 2 - CNAME Record:**
```
Type:  CNAME
Name:  www
Value: your-site-name.netlify.app
TTL:   3600
```

### Example Configuration in GoDaddy:

| Type  | Name | Value                          | TTL  |
|-------|------|--------------------------------|------|
| A     | @    | 75.2.60.5                      | 3600 |
| CNAME | www  | bethesdabiblechapel.netlify.app | 3600 |

---

## Step 3: Verify & Enable HTTPS

1. **Check domain status in Netlify**:
   - Go to "Domain settings"
   - You should see "Netlify DNS" or "External DNS configured"
   - Status should show "DNS configured correctly"

2. **Enable HTTPS**:
   - Netlify automatically provisions SSL certificate
   - Usually takes 1-2 minutes after DNS is configured
   - You'll see "HTTPS" with a green checkmark

3. **Force HTTPS** (recommended):
   - In Domain settings, scroll to "HTTPS"
   - Toggle "Force HTTPS" to ON
   - All HTTP requests redirect to HTTPS

---

## Step 4: Configure WWW Redirect

Choose how you want your domain to work:

### Option 1: Redirect www to non-www (Recommended)
```
www.bethesdabiblechapel.org → bethesdabiblechapel.org
```

### Option 2: Redirect non-www to www
```
bethesdabiblechapel.org → www.bethesdabiblechapel.org
```

**To configure in Netlify:**
1. Go to "Domain settings"
2. Under "Domain management" → "Domains"
3. Click on your domain
4. Choose your preferred redirect option

---

## Verification Steps

### 1. Check DNS Propagation

**Online tools:**
- [dnschecker.org](https://dnschecker.org)
- [whatsmydns.net](https://whatsmydns.net)

Enter your domain and check if:
- A records point to Netlify IPs
- CNAME points to your Netlify site

### 2. Test Your Domain

```bash
# Check DNS resolution
nslookup bethesdabiblechapel.org

# Check if site loads
curl -I https://bethesdabiblechapel.org
```

### 3. Browser Test

Open in browser:
- `http://yourdomain.com` → Should redirect to HTTPS
- `https://yourdomain.com` → Should load your site
- `https://www.yourdomain.com` → Should work or redirect

---

## Troubleshooting

### DNS Not Updating

**Problem**: Changes not reflected after 24 hours

**Solutions**:
1. **Clear DNS cache locally**:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo killall -HUP mDNSResponder
   ```

2. **Verify records are correct** in your registrar
3. **Wait longer** - Can take up to 48 hours

### SSL Certificate Not Provisioning

**Problem**: HTTPS not working

**Solutions**:
1. **Wait** - Can take up to 24 hours
2. **Check DNS** - Must be fully propagated first
3. **Remove and re-add domain** in Netlify
4. **Contact Netlify support** if stuck

### Site Not Loading

**Problem**: Domain loads but shows error

**Solutions**:
1. **Check Netlify deploy status** - Ensure site deployed successfully
2. **Verify DNS records** match Netlify's requirements exactly
3. **Check domain is added** in Netlify dashboard
4. **Clear browser cache**

### WWW Not Working

**Problem**: Only apex domain works (or vice versa)

**Solutions**:
1. **Add both domains** to Netlify:
   - `bethesdabiblechapel.org`
   - `www.bethesdabiblechapel.org`
2. **Set up CNAME** for www subdomain
3. **Configure redirect** in Netlify settings

---

## Common Domain Registrars - Quick Links

### GoDaddy
- Dashboard: [dcc.godaddy.com](https://dcc.godaddy.com)
- Go to: Products → Domains → [Your Domain] → DNS Management

### Namecheap
- Dashboard: [ap.www.namecheap.com](https://ap.www.namecheap.com)
- Go to: Domain List → Manage → Advanced DNS

### Google Domains
- Dashboard: [domains.google.com](https://domains.google.com)
- Go to: My domains → [Your Domain] → DNS

### Cloudflare
- Dashboard: [dash.cloudflare.com](https://dash.cloudflare.com)
- Go to: [Your Domain] → DNS

### Hover
- Dashboard: [hover.com](https://hover.com)
- Go to: Domains → [Your Domain] → DNS

---

## After DNS is Setup

### Update Your Site

Add your custom domain to the site:

**In `components/footer.html`** (if you have links):
```html
<!-- Update any hardcoded URLs -->
<a href="https://bethesdabiblechapel.org">Visit our website</a>
```

**In social media**:
- Update Facebook, Instagram, etc. with new domain

**Google Search Console**:
1. Add your custom domain as a new property
2. Verify ownership (Netlify makes this easy)
3. Submit sitemap

---

## DNS Configuration Examples

### Example 1: Apex + WWW (Most Common)

```
# Apex domain
Type: A
Name: @
Value: 75.2.60.5

# WWW subdomain  
Type: CNAME
Name: www
Value: bethesdabiblechapel.netlify.app
```

### Example 2: With Subdomains

```
# Main site
Type: A
Name: @
Value: 75.2.60.5

# WWW
Type: CNAME
Name: www
Value: bethesdabiblechapel.netlify.app

# Blog subdomain
Type: CNAME
Name: blog
Value: bethesdabiblechapel.netlify.app
```

---

## Quick Reference

| What | Where | What to Do |
|------|-------|------------|
| **Netlify** | Domain Settings | Add custom domain |
| **Registrar** | Nameservers | Point to Netlify DNS (easiest) |
| **OR Registrar** | DNS Records | Add A and CNAME records |
| **Wait** | 1-24 hours | DNS propagation |
| **Netlify** | HTTPS | Enable & force HTTPS |
| **Test** | Browser | Visit your domain! |

---

## Support

- **Netlify DNS Docs**: [docs.netlify.com/domains-https/custom-domains](https://docs.netlify.com/domains-https/custom-domains)
- **Netlify Support**: [support.netlify.com](https://support.netlify.com)
- **Community Forum**: [answers.netlify.com](https://answers.netlify.com)

---

## Your Next Steps

1. [ ] Add domain to Netlify dashboard
2. [ ] Choose DNS option (Netlify DNS or manual)
3. [ ] Update nameservers/DNS records
4. [ ] Wait for DNS propagation
5. [ ] Verify HTTPS is working
6. [ ] Enable force HTTPS
7. [ ] Test all pages
8. [ ] Update social media links
9. [ ] Celebrate! 🎉

---

**Need Help?**

Share:
- Your domain name
- Your Netlify site URL
- Where you bought the domain

And I can provide specific instructions!
