# Fix Cloudflare Pages Build Error

## The Problem:
Cloudflare is running `wrangler deploy` (Workers command) instead of `wrangler pages deploy` (Pages command).

## The Solution:

### Option 1: Set Build Command to Empty (Recommended for Static Sites)
1. Go to: https://dash.cloudflare.com/
2. Click: **Workers & Pages** → **bethesdabiblechapelprod**
3. Click: **Settings** → **Builds & deployments**
4. Set **Build command**: Leave completely **EMPTY** (delete any text)
5. Set **Build output directory**: `/` or `.`
6. Set **Root directory**: Leave **EMPTY**
7. Click: **Save**
8. Go to **Deployments** tab → Click **Retry deployment**

### Option 2: Remove wrangler.toml (If Option 1 Doesn't Work)
The `wrangler.toml` file might be confusing Cloudflare into thinking this is a Workers project.

**Temporarily rename it:**
```bash
git mv wrangler.toml wrangler.toml.backup
git commit -m "Temporarily disable wrangler.toml for Pages deployment"
git push
```

This will force Cloudflare to treat it as a pure static site.

**After deployment succeeds, you can restore it if needed for local dev:**
```bash
git mv wrangler.toml.backup wrangler.toml
git commit -m "Restore wrangler.toml"
git push
```

### Why This Happens:
- Your site is **pure HTML/CSS/JS** (no build needed)
- The `wrangler.toml` file makes Cloudflare think it's a Workers project
- Cloudflare auto-detects and tries to run `wrangler deploy` (wrong command)

### Expected Result:
✅ Build should complete in seconds (no compilation needed)
✅ All HTML, CSS, JS, and image files deployed
✅ Site live at: https://bethesdabiblechapelprod.pages.dev/
