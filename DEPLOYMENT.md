# Vercel Deployment Guide for simeonrubin.com

This guide explains how to deploy both the CMS and Frontend applications to Vercel as a monorepo, replacing your existing deployment at www.simeonrubin.com.

## Deployment Strategy

- **Two separate Vercel projects** from the same GitHub repository
- **CMS**: Deployed at `cms.simeonrubin.com`
- **Frontend**: Deployed at `www.simeonrubin.com` (replaces existing deployment)
- **Database**: SQLite (free, no external costs)
- **Media Storage**: Vercel's filesystem (ephemeral but works with ISR)

## Prerequisites

1. GitHub account with your repository pushed
2. Vercel account (you already have one for www.simeonrubin.com)
3. Both apps should build successfully locally
4. Access to DNS settings for simeonrubin.com domain

## Quick Start Checklist

- [ ] Step 1: Deploy CMS to new Vercel project
- [ ] Step 1.2: Set environment variables for CMS
- [ ] Step 1.4: Add DNS record for cms.simeonrubin.com
- [ ] Step 1.5: Create admin user and add projects
- [ ] Step 2: Update existing www.simeonrubin.com project settings
- [ ] Step 2.2: Set NEXT_PUBLIC_CMS_URL environment variable
- [ ] Step 2.3: Redeploy frontend
- [ ] Step 3: Verify images load correctly
- [ ] Test both sites work correctly

## Step 1: Deploy CMS Application

### 1.1 Create New Project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in to your existing account
2. Click "Add New..." → "Project"
3. Import your `portfolio-2025` GitHub repository
4. Configure the project:
   - **Project Name**: `simeonrubin-cms` (or your preferred name)
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/cms` ⚠️ **IMPORTANT**
   - **Build Command**: Leave default (`npm run build`)
   - **Output Directory**: Leave default (`.next`)
   - **Install Command**: Leave default (`npm install`)

### 1.2 Configure Environment Variables

Add these environment variables in the Vercel dashboard (Project → Settings → Environment Variables):

```
DATABASE_URI=file:./cms.db
PAYLOAD_SECRET=<generate-a-secure-random-string>
NEXT_PUBLIC_SERVER_URL=https://cms.simeonrubin.com
CRON_SECRET=<optional-generate-if-needed>
```

⚠️ **Note**: Set `NEXT_PUBLIC_SERVER_URL` to `https://cms.simeonrubin.com` (your final custom domain) even though it's not set up yet.

To generate secure secrets:

```bash
openssl rand -base64 32
```

### 1.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. You'll get a temporary URL like `https://simeonrubin-cms.vercel.app`

### 1.4 Add Custom Domain (cms.simeonrubin.com)

1. In your CMS project dashboard → Settings → Domains
2. Click "Add Domain"
3. Enter: `cms.simeonrubin.com`
4. Vercel will provide DNS instructions:
   - **Type**: CNAME
   - **Name**: `cms`
   - **Value**: `cname.vercel-dns.com`
5. Add this CNAME record to your domain registrar (where simeonrubin.com is managed)
6. Wait for DNS propagation (usually 5-60 minutes)

### 1.5 Access Admin Panel

- Visit: `https://cms.simeonrubin.com/admin`
- Create your first admin user
- Start adding projects!

## Step 2: Deploy Frontend Application (Replace Existing www.simeonrubin.com)

You have two options: update your existing project or create a new one.

### Option A: Update Existing Project (Recommended)

1. Go to your existing Vercel project for www.simeonrubin.com
2. Go to Settings → General
3. Update:
   - **Root Directory**: Change to `apps/frontend` ⚠️ **CRITICAL**
   - **Build Command**: Ensure it's `npm run build`
   - **Output Directory**: Ensure it's `.next`
4. Go to Settings → Git
5. Ensure it's connected to your `portfolio-2025` repository
6. The domain www.simeonrubin.com should already be configured

### Option B: Create New Project (If you prefer a fresh start)

1. **First**: Remove www.simeonrubin.com domain from your old project:
   - Go to old project → Settings → Domains
   - Click the domain → Remove
2. **Then**: Create new project:
   - Click "Add New..." → "Project"
   - Import `portfolio-2025` repository
   - Configure:
     - **Project Name**: `simeonrubin-portfolio`
     - **Framework Preset**: Next.js
     - **Root Directory**: `apps/frontend` ⚠️ **IMPORTANT**
     - **Build Command**: Leave default (`npm run build`)
     - **Output Directory**: Leave default (`.next`)
     - **Install Command**: Leave default (`npm install`)

### 2.2 Configure Environment Variables

Go to Project → Settings → Environment Variables and add:

```
NEXT_PUBLIC_CMS_URL=https://cms.simeonrubin.com
```

⚠️ **Important**: Use `https://cms.simeonrubin.com` (not the temporary Vercel URL)

### 2.3 Deploy

1. If using Option A: Go to Deployments → Click "Redeploy" on latest deployment
2. If using Option B: Click "Deploy"
3. Wait for the build to complete

### 2.4 Verify Domain (If using Option B)

1. Go to Settings → Domains
2. Click "Add Domain"
3. Enter: `www.simeonrubin.com` and `simeonrubin.com`
4. If you removed it from the old project, it should be available immediately
5. Vercel will automatically configure both domains

## Step 3: Verify Configuration

✅ The `apps/frontend/next.config.ts` is already configured to allow images from `cms.simeonrubin.com`.

Make sure to push all your changes to GitHub before deploying:

```bash
git add .
git commit -m "Configure for simeonrubin.com deployment"
git push origin main
```

This will trigger automatic deployments on both Vercel projects (if configured for continuous deployment).

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

1. Verify `NEXT_PUBLIC_CMS_URL=https://cms.simeonrubin.com` is set in frontend
2. Check Next.js remote patterns in `next.config.ts` includes `cms.simeonrubin.com`
3. Ensure media files were uploaded in CMS admin panel

### CMS Admin Not Accessible:

1. Check that `PAYLOAD_SECRET` is set in CMS environment variables
2. Verify `NEXT_PUBLIC_SERVER_URL=https://cms.simeonrubin.com` in CMS environment variables
3. Clear browser cache and try incognito mode
4. Check deployment logs for errors

### Projects Not Showing on Frontend:

1. Ensure projects are published (not draft) in CMS admin
2. Check that `NEXT_PUBLIC_CMS_URL=https://cms.simeonrubin.com` in frontend environment variables
3. Verify CMS API is accessible: `https://cms.simeonrubin.com/api/projects`
4. Check browser console for errors on www.simeonrubin.com
5. Verify both deployments completed successfully

### Wrong Content Showing After Deployment:

1. Remember: SQLite database resets on each deployment
2. You'll need to re-add content in CMS admin after each CMS deployment
3. Consider using Payload's seed script or switching to a persistent database for production

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

✅ **Cost**: FREE (using Vercel free tier + SQLite)
✅ **Performance**: Fast (ISR + Vercel Edge Network)
✅ **Maintenance**: Low (auto-deploys, no server management)
✅ **Your Sites**:

- Frontend: https://www.simeonrubin.com
- CMS Admin: https://cms.simeonrubin.com/admin

Once deployed, your portfolio will:

- ✅ Load fast from Vercel's edge network
- ✅ Auto-deploy on git push to main branch
- ✅ Be manageable via CMS without touching code
- ✅ Support dynamic projects, blog posts, and pages

**Next Steps After Deployment:**

1. Log in to https://cms.simeonrubin.com/admin
2. Add your projects with images and descriptions
3. Publish them (toggle from draft to published)
4. Visit https://www.simeonrubin.com to see them live!

🎉 Your portfolio CMS is now live and manageable!
