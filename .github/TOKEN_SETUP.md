# 🔑 CLOUDFLARE API TOKEN SETUP FOR GITHUB ACTIONS

## Quick Steps to Add the API Token:

### Option 1: Create a New API Token (Recommended)

1. **Go to Cloudflare API Tokens page:**
   https://dash.cloudflare.com/profile/api-tokens

2. **Click "Create Token"**

3. **Use the "Cloudflare Pages" template** (recommended)
   - This automatically sets the correct permissions
   - Click "Use template" next to "Cloudflare Pages"

4. **OR create a Custom Token with these permissions:**
   - Account → Cloudflare Pages → Edit
   - Account → Account Settings → Read

5. **Set Account Resources:**
   - Include → Specific account → Select "Benilmathew@gmail.com's Account"

6. **Click "Continue to summary"** → **Create Token**

7. **COPY THE TOKEN** (you'll only see it once!)

### Option 2: Add Token to GitHub

1. **Go to your repository secrets:**
   https://github.com/benilmathew/bethesdabiblechapel/settings/secrets/actions

2. **Click "New repository secret"**

3. **Fill in:**
   - **Name:** `CLOUDFLARE_API_TOKEN` (exact name, case-sensitive)
   - **Value:** Paste the token you copied from step 7

4. **Click "Add secret"**

### Option 3: Test the Auto-Deploy

Once the secret is added, make any change and push:

```powershell
# Make a small test change
echo "# Test" >> README.md

# Commit and push
git add README.md
git commit -m "Test auto-deploy"
git push origin main
```

Then check the deployment status:
- GitHub Actions: https://github.com/benilmathew/bethesdabiblechapel/actions
- Cloudflare Pages: https://dash.cloudflare.com/pages

---

## Troubleshooting

### If the workflow still fails:

1. **Verify the secret name is exactly:** `CLOUDFLARE_API_TOKEN`
2. **Check token permissions** include "Cloudflare Pages Edit"
3. **Re-run the failed workflow** after adding the secret

### Alternative: Use Cloudflare Dashboard Integration

If you prefer not to use GitHub Actions:

1. Go to: https://dash.cloudflare.com/pages
2. Click on "bethesdabiblechapel" project
3. Settings → Builds & deployments → Connect to Git
4. Select GitHub and authorize
5. Choose your repository

This enables automatic deployments without needing to add the token to GitHub.

---

## Current Status

✅ GitHub Actions workflow is configured
❌ Waiting for `CLOUDFLARE_API_TOKEN` secret to be added
📋 Follow the steps above to complete the setup

Once the token is added, every push to `main` will automatically deploy! 🚀
