# 🔑 Custom Cloudflare API Token Setup

## Step-by-Step Guide (Since "Cloudflare Pages" template is not visible)

### 1. Go to Cloudflare API Tokens
🔗 https://dash.cloudflare.com/profile/api-tokens

### 2. Click "Create Token"

### 3. Scroll down and click "Create Custom Token"

### 4. Configure Token Settings:

**Token name:** `GitHub Actions - Bethesda`

**Permissions:**
```
┌─────────────────────────────────────────────────┐
│ Account                                         │
│   ├─ Cloudflare Pages .......... Edit          │
│   └─ Account Settings .......... Read          │
└─────────────────────────────────────────────────┘
```

**How to add permissions:**
1. Click "Add more" under Permissions
2. Select "Account" from dropdown
3. Select "Cloudflare Pages" 
4. Select "Edit"
5. Click "Add more" again
6. Select "Account"
7. Select "Account Settings"
8. Select "Read"

### 5. Account Resources:

```
Include → Specific account → Benilmathew@gmail.com's Account
```

### 6. Client IP Address Filtering (Optional - Skip):
Leave as "All IPs"

### 7. TTL (Time to Live):
Leave as default or set to 1 year

### 8. Click "Continue to summary"

### 9. Review and click "Create Token"

### 10. ⚠️ COPY THE TOKEN IMMEDIATELY
You'll only see it once! Copy it to clipboard.

---

## Add Token to GitHub

### 1. Go to Repository Secrets:
🔗 https://github.com/benilmathew/bethesdabiblechapel/settings/secrets/actions

### 2. Click "New repository secret"

### 3. Enter Details:
- **Name:** `CLOUDFLARE_API_TOKEN` (exactly as shown, case-sensitive)
- **Value:** Paste the token you copied

### 4. Click "Add secret"

---

## Test the Setup

Once the secret is added, go to:
🔗 https://github.com/benilmathew/bethesdabiblechapel/actions

Find the failed workflow and click **"Re-run all jobs"**

Or make a test commit:
```powershell
echo "# Test" >> README.md
git add README.md
git commit -m "Test auto-deploy"
git push origin main
```

---

## Alternative: Dashboard Git Integration (Easier!)

If creating the token is too complex, use Cloudflare's built-in Git integration:

1. Go to: https://dash.cloudflare.com/pages
2. Click "bethesdabiblechapel" project
3. Click "Settings" tab
4. Scroll to "Source" section
5. Click "Connect to Git"
6. Select "GitHub"
7. Authorize Cloudflare
8. Select your repository
9. Done! No token needed.

This is actually the recommended approach - it's simpler and more secure.

---

## Visual Guide Summary

```
Cloudflare Dashboard
  └─ Profile (top right)
      └─ API Tokens
          └─ Create Token
              └─ Create Custom Token
                  ├─ Permissions:
                  │   ├─ Account > Cloudflare Pages > Edit
                  │   └─ Account > Account Settings > Read
                  ├─ Account Resources:
                  │   └─ Include > Your Account
                  └─ Create Token
                      └─ Copy Token → Paste to GitHub Secrets
```

---

## Still Having Issues?

Use the **Cloudflare Dashboard Git Integration** method instead. It's faster and doesn't require managing tokens.
