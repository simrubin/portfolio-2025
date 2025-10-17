# Vercel Deployment Guide

This guide explains how to deploy both the CMS and Frontend applications to Vercel as a cost-effective monorepo.

## Deployment Strategy

- **Two separate Vercel projects** from the same GitHub repository
- **CMS**: Deployed at a subdomain or separate domain (e.g., `cms.yourdomain.com`)
- **Frontend**: Deployed at your main domain (e.g., `yourdomain.com`)
- **Database**: SQLite (free, no external costs)
- **Media Storage**: Vercel's filesystem (ephemeral but works with ISR)

## Prerequisites

1. GitHub account with your repository pushed
2. Vercel account (free tier is sufficient)
3. Both apps should build successfully locally

## Step 1: Deploy CMS Application

### 1.1 Create New Project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Project Name**: `portfolio-cms` (or your preferred name)
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/cms`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm install`

### 1.2 Configure Environment Variables

Add these environment variables in the Vercel dashboard:

```
DATABASE_URI=file:./cms.db
PAYLOAD_SECRET=<generate-a-secure-random-string>
NEXT_PUBLIC_SERVER_URL=https://your-cms-project.vercel.app
CRON_SECRET=<optional-generate-if-needed>
```

To generate secure secrets:

```bash
openssl rand -base64 32
```

### 1.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Note your CMS URL (e.g., `https://portfolio-cms.vercel.app`)

### 1.4 Access Admin Panel

- Visit: `https://your-cms-url.vercel.app/admin`
- Create your first admin user
- Start adding projects!

## Step 2: Deploy Frontend Application

### 2.1 Create Second Project on Vercel

1. In Vercel dashboard, click "Add New..." → "Project"
2. Import the **same GitHub repository**
3. Configure the project:
   - **Project Name**: `portfolio-frontend` (or your preferred name)
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm install`

### 2.2 Configure Environment Variables

Add this environment variable:

```
NEXT_PUBLIC_CMS_URL=https://your-cms-project.vercel.app
```

(Use the exact URL from Step 1.3)

### 2.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your frontend is now live!

## Step 3: Configure Custom Domains (Optional)

### For CMS:

1. Go to CMS project → Settings → Domains
2. Add your custom domain: `cms.yourdomain.com`
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SERVER_URL` environment variable to new domain

### For Frontend:

1. Go to Frontend project → Settings → Domains
2. Add your custom domain: `yourdomain.com`
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_CMS_URL` environment variable to point to CMS custom domain

## Step 4: Update Frontend Next.js Config

After deploying, if you're using a custom domain for CMS, update `apps/frontend/next.config.ts`:

```typescript
{
  protocol: "https",
  hostname: "cms.yourdomain.com",
  pathname: "/media/**",
}
```

Then redeploy the frontend.

## Important Notes on SQLite + Vercel

⚠️ **Vercel's filesystem is ephemeral** - this means:

- Files written during runtime are lost on new deployments
- SQLite database resets on each deployment
- **Solution**: Use Payload's database migrations or seed script to initialize data

### Recommended Approach:

1. **Local Development**: Add all projects and content locally
2. **Export Data**: Use Payload's API to export your data
3. **Seed on Deploy**: Create a seed script that runs on deployment

### Alternative (Production-Ready):

For a production site with persistent data, consider:

- **Payload Cloud** (paid but optimized for Payload)
- **Vercel Postgres** (has free tier)
- **PlanetScale** (MySQL, has free tier)
- **Supabase** (PostgreSQL, has free tier)

Update `apps/cms/src/payload.config.ts` to use the appropriate adapter.

## ISR (Incremental Static Regeneration)

Both apps are configured with ISR:

- Pages revalidate every 60 seconds
- First visitor after 60s triggers rebuild
- Subsequent visitors see cached version
- Very cost-effective on Vercel free tier

## Monitoring & Costs

### Free Tier Limits (Hobby Plan):

- 100 GB bandwidth per month
- Unlimited deployments
- Automatic HTTPS
- 100 GB-Hrs compute time

### To Stay Within Free Tier:

- Use ISR (already configured)
- Optimize images (Next.js Image component handles this)
- Keep SQLite or use free database tiers
- Projects should easily stay within free limits for portfolio use

## Troubleshooting

### Build Failures:

1. Check build logs in Vercel dashboard
2. Ensure root directory is set correctly
3. Verify all dependencies are in package.json
4. Check that environment variables are set

### Images Not Loading:

1. Verify `NEXT_PUBLIC_CMS_URL` is correct
2. Check Next.js remote patterns in `next.config.ts`
3. Ensure media files were uploaded in CMS

### CMS Admin Not Accessible:

1. Check that `PAYLOAD_SECRET` is set
2. Verify `NEXT_PUBLIC_SERVER_URL` matches your deployment URL
3. Clear browser cache

### Projects Not Showing on Frontend:

1. Ensure projects are published (not draft)
2. Check that `NEXT_PUBLIC_CMS_URL` points to CMS
3. Verify CMS API is accessible: `https://your-cms-url.vercel.app/api/projects`
4. Check browser console for errors

## Local Testing Before Deploy

```bash
# Test CMS build
cd apps/cms
npm run build
npm run start

# Test Frontend build
cd apps/frontend
npm run build
npm run start
```

## Continuous Deployment

Once set up, both projects auto-deploy on git push:

- Push to main branch → Vercel builds and deploys automatically
- Vercel provides preview deployments for pull requests

## Summary

✅ Cost: **FREE** (using Vercel free tier + SQLite)
✅ Performance: Fast (ISR + Vercel Edge Network)
✅ Maintenance: Low (auto-deploys, no server management)
✅ Scalability: Good for portfolio sites

Your portfolio CMS is now live and manageable! 🎉
