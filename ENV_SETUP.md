# Environment Variables Setup

This guide explains how to set up environment variables for both the CMS and Frontend applications.

## CMS Application (`apps/cms`)

Create a `.env` file in `apps/cms/` with the following variables:

```env
# Database (SQLite - no external costs)
DATABASE_URI=file:./cms.db

# Payload Secret (generate a secure random string)
# Generate using: openssl rand -base64 32
PAYLOAD_SECRET=your-secret-here

# Server URL (for CORS and link generation)
# Development:
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
# Production (after deploying):
# NEXT_PUBLIC_SERVER_URL=https://your-cms-domain.vercel.app

# Optional: Vercel Cron Secret (for scheduled jobs)
CRON_SECRET=your-cron-secret-here
```

## Frontend Application (`apps/frontend`)

Create a `.env.local` file in `apps/frontend/` with the following variables:

```env
# CMS API URL
# Development:
NEXT_PUBLIC_CMS_URL=http://localhost:3000

# Production (after deploying CMS):
# NEXT_PUBLIC_CMS_URL=https://your-cms-domain.vercel.app
```

## Vercel Deployment - Environment Variables

### For CMS Project (cms.yourdomain.com):

1. Go to Vercel Dashboard → Your CMS Project → Settings → Environment Variables
2. Add the following:
   - `DATABASE_URI`: `file:./cms.db`
   - `PAYLOAD_SECRET`: (generate a secure string)
   - `NEXT_PUBLIC_SERVER_URL`: `https://your-cms-domain.vercel.app`
   - `CRON_SECRET`: (optional, for scheduled tasks)

### For Frontend Project (yourdomain.com):

1. Go to Vercel Dashboard → Your Frontend Project → Settings → Environment Variables
2. Add the following:
   - `NEXT_PUBLIC_CMS_URL`: `https://your-cms-domain.vercel.app`

## Important Notes

- The `NEXT_PUBLIC_` prefix makes variables accessible in the browser
- Never commit `.env` or `.env.local` files to git (they're in .gitignore)
- Generate strong random strings for secrets
- Update production URLs after deploying to Vercel
- Both apps can be in the same monorepo but deployed as separate Vercel projects

## Local Development

1. Start CMS (from root or `apps/cms`):

   ```bash
   cd apps/cms
   npm run dev
   # CMS runs at http://localhost:3000
   # Admin panel: http://localhost:3000/admin
   ```

2. Start Frontend (from root or `apps/frontend`):

   ```bash
   cd apps/frontend
   npm run dev
   # Frontend runs at http://localhost:3001 (or next available port)
   ```

3. Make sure the `NEXT_PUBLIC_CMS_URL` in frontend points to where CMS is running
