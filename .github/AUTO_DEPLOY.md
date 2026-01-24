# GitHub Actions Auto-Deploy Setup

This repository is configured to automatically deploy to Cloudflare Pages on every push to `main`.

## Setup Instructions

### 1. Get Your Cloudflare API Token

You already have a Cloudflare API token from when you ran `wrangler login`. To use it with GitHub Actions:

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the **"Cloudflare Pages"** template
4. Or create a custom token with these permissions:
   - Account > Cloudflare Pages > Edit
5. Copy the token

### 2. Add Token to GitHub Secrets

1. Go to your GitHub repository: https://github.com/benilmathew/bethesdabiblechapel
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `CLOUDFLARE_API_TOKEN`
5. Value: Paste your Cloudflare API token
6. Click **"Add secret"**

### 3. Push Changes

Once the secret is added, the workflow will automatically run on every push to `main`:

```bash
git add .
git commit -m "Enable auto-deploy with GitHub Actions"
git push origin main
```

## How It Works

- **Push to `main`** → Automatic production deployment
- **Pull Requests** → Automatic preview deployments
- **Other branches** → Manual deployment via `npm run deploy`

## Deployment URLs

- **Production:** https://bethesdabiblechapel.pages.dev/
- **Preview:** Unique URL for each PR/branch

## Manual Deployment (if needed)

You can still deploy manually using:

```bash
npm run deploy
```

## Monitoring Deployments

- GitHub Actions tab: https://github.com/benilmathew/bethesdabiblechapel/actions
- Cloudflare Pages dashboard: https://dash.cloudflare.com/pages

---

**Status:** ✅ GitHub Actions workflow configured and ready
**Action Required:** Add `CLOUDFLARE_API_TOKEN` to GitHub repository secrets
