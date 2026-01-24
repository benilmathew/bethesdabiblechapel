# Recreate Cloudflare Pages with Git Integration

If you want native Git integration (no API tokens needed), follow these steps:

## Steps:

### 1. Delete Current Project
```powershell
npx wrangler pages project delete bethesdabiblechapel
```

### 2. Go to Cloudflare Dashboard
- Visit: https://dash.cloudflare.com/
- Click: **Workers & Pages** (left sidebar)
- Click: **Create application**
- Click: **Pages** tab
- Click: **Connect to Git**

### 3. Connect GitHub
- Select **GitHub**
- Authorize Cloudflare (if needed)
- Select repository: **benilmathew/bethesdabiblechapel**
- Click **Begin setup**

### 4. Configure Build Settings
- **Project name**: `bethesdabiblechapel`
- **Production branch**: `main`
- **Build command**: (leave empty - it's a static site)
- **Build output directory**: `/` or `.`
- Click **Save and Deploy**

### 5. Done!
Every push to `main` will now auto-deploy. No API tokens or GitHub Actions needed!

## Trade-offs:

**Git Integration:**
- ✅ Simpler - no tokens to manage
- ✅ Native Cloudflare UI for deployments
- ✅ Built-in preview deployments
- ❌ Must delete and recreate project
- ❌ New deployment URL/ID

**GitHub Actions (Current):**
- ✅ Keep existing project & URL
- ✅ More control over deployment process
- ❌ Need to manage API token
- ❌ Uses GitHub Actions minutes

## Recommendation:
**Go with Git Integration** - it's much simpler for static sites!
