# Wrangler Commands for Local Development

These commands are for local development only. 
Cloudflare Pages will auto-deploy from GitHub (no manual commands needed).

## Local Development:
```bash
npx wrangler pages dev . --compatibility-date=2024-01-01
```

## Manual Deploy (if needed):
```bash
npx wrangler pages deploy . --project-name=bethesdabiblechapel
```

## Database Commands (if you add D1 later):
```bash
npx wrangler d1 execute DB --file=./schema.sql
npx wrangler d1 execute DB --file=./schema.sql --remote
```

## Note:
These commands were removed from package.json to prevent Cloudflare Pages 
from auto-detecting and trying to run them during Git deployments.
