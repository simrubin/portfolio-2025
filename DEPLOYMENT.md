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

- [ ] **Step 0**: Export your local project data (CRITICAL!)
- [ ] **Step 1**: Create Vercel Postgres database
- [ ] **Step 2**: Create CMS project, add env vars, and deploy once
- [ ] **Step 3**: Connect database to deployed CMS project
- [ ] **Step 4**: Redeploy CMS with database connected
- [ ] **Step 5**: Create admin user (initializes database)
- [ ] **Step 6**: Add custom domain (cms.simeonrubin.com)
- [ ] **Step 7**: Import your 9 projects + 81 media files
- [ ] **Step 8**: Deploy frontend to www.simeonrubin.com
- [ ] **Step 9**: Test everything works correctly

## Step 0: Export Your Local Data ⚠️ CRITICAL

**Before deploying, backup your project data!**

You have **9 projects and 81 media files** in your local CMS. Run the export script:

```bash
# From project root
node export-data.js
```

This creates `data-backup/` folder with:

- `projects-export.json` - All your project data
- `media-export.json` - Media metadata
- `media-files/` - Actual image files (copied automatically)

✅ **Already done!** Your data is backed up and ready for import after deployment.

## Step 1: Create Vercel Postgres Database First

**Why?** Ensures your project data persists across deployments (SQLite resets on each deploy).

### 1.1 Create Database

1. Go to [Vercel Dashboard → Storage](https://vercel.com/dashboard/stores)
2. Click **Create Database**
3. Select **Postgres** → Choose **Neon Serverless Postgres**
4. Configure:
   - **Name**: `portfolio-cms-db`
   - **Region**: Choose closest to you (e.g., US East)
5. Click **Create**

⏱️ Takes ~30 seconds

### 1.2 Save Connection Details

After creation, you'll see the database dashboard. Keep this tab open - you'll need it in Step 3.

## Step 2: Create CMS Vercel Project

### 2.1 Create and Deploy Project

1. **In a new tab**, go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your `portfolio-2025` GitHub repository
4. Configure the project:
   - **Project Name**: `portfolio-cms` (or your preferred name)
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/cms` ⚠️ **IMPORTANT**
   - **Build Command**: Leave default (`npm run build`)
   - **Output Directory**: Leave default (`.next`)
   - **Install Command**: Leave default (`npm install`)

### 2.2 Add Initial Environment Variables (Before Deploying)

Before clicking Deploy, add these environment variables:

```
PAYLOAD_SECRET=<generate-a-secure-random-string>
NEXT_PUBLIC_SERVER_URL=https://portfolio-cms.vercel.app
```

Generate secret:

```bash
openssl rand -base64 32
```

**Note**: Use the temporary `.vercel.app` URL for now. We'll update it later with your custom domain.

### 2.3 Deploy First Time

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. ⚠️ **This first deployment will fail or have issues - that's expected!** We haven't connected the database yet.

## Step 3: Connect Database to Project

### 3.1 Link Database to Deployed Project

1. Go back to your **Postgres database** tab (from Step 1)
2. Click **Connect Project** button
3. Now **portfolio-cms** should appear in the dropdown! ✅
4. Select it and click **Connect**

✅ Vercel automatically adds all Postgres environment variables to your project!

### 3.2 Verify Auto-Added Variables

Go to your CMS project → Settings → Environment Variables

You should now see (auto-added by Vercel):

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- And several others...

## Step 4: Redeploy with Database Connected

Now that the database is connected, you need to redeploy so the CMS can use Postgres:

### 4.1 Trigger Redeploy

1. Go to your CMS project → **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **"Redeploy"**
4. Check ✅ **"Use existing Build Cache"** (faster)
5. Click **"Redeploy"**

⏱️ Takes 2-3 minutes

### 4.2 Verify Successful Deployment

This time, the deployment should succeed with Postgres connected!

✅ Your CMS is now live at: `https://portfolio-cms.vercel.app` (or your project's URL)

## Step 5: Initialize Database Schema

### 5.1 Create Admin User

1. Visit your deployment URL's admin: `https://portfolio-cms.vercel.app/admin`
2. **Create your first admin user**
   - Email: Your email
   - Password: Secure password (save it!)
3. Payload automatically creates all database tables on first run ✨

🎉 Your CMS is now running with Postgres! Data will persist forever.

## Step 6: Add Custom Domain (cms.simeonrubin.com)

### 6.1 Configure Domain

1. In your CMS project dashboard → Settings → Domains
2. Click **"Add Domain"**
3. Enter: `cms.simeonrubin.com`
4. Vercel will provide DNS instructions:
   - **Type**: CNAME
   - **Name**: `cms`
   - **Value**: `cname.vercel-dns.com`

### 6.2 Update DNS

1. Go to your domain registrar (where you manage simeonrubin.com)
2. Add the CNAME record
3. Wait for DNS propagation (5-60 minutes)
4. Vercel will automatically detect when it's ready

✅ Your CMS admin panel: `https://cms.simeonrubin.com/admin`

## Step 7: Import Your Project Data

**Now restore your 9 projects and 81 media files!**

### 7.1 Upload Media Files

1. Go to `https://cms.simeonrubin.com/admin`
2. Navigate to **Media** collection
3. Bulk upload images from `data-backup/media-files/` folder
   - You can select multiple files at once
   - Upload the ones referenced in your projects first

⏱️ This may take 5-10 minutes depending on file sizes

### 7.2 Run Import Script

```bash
# From your project root
node import-data.js
```

Follow the prompts:

- **CMS URL**: `https://cms.simeonrubin.com`
- **Admin email**: (the one you created in Step 5.2)
- **Admin password**: (your password)

The script will:

- ✅ Import all 9 projects
- ✅ Preserve project structure
- ⚠️ You'll need to manually relink images (script will guide you)

### 7.3 Verify Projects

1. Visit: `https://cms.simeonrubin.com/api/projects`
2. You should see your projects as JSON!
3. Check admin panel to verify all projects imported correctly

## Step 8: Deploy Frontend Application (Replace Existing www.simeonrubin.com)

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
     - **Project Name**: `portfolio-frontend`
     - **Framework Preset**: Next.js
     - **Root Directory**: `apps/frontend` ⚠️ **IMPORTANT**
     - **Build Command**: Leave default (`npm run build`)
     - **Output Directory**: Leave default (`.next`)
     - **Install Command**: Leave default (`npm install`)

### 8.2 Configure Environment Variables

Go to Project → Settings → Environment Variables and add:

```
NEXT_PUBLIC_CMS_URL=https://cms.simeonrubin.com
```

⚠️ **Important**: Use `https://cms.simeonrubin.com` (not the temporary Vercel URL)

### 8.3 Deploy

1. If using Option A: Go to Deployments → Click **"Redeploy"** on latest deployment
2. If using Option B: Click **"Deploy"**
3. Wait for the build to complete (2-3 minutes)

### 8.4 Verify Domain (If using Option B)

1. Go to Settings → Domains
2. Click "Add Domain"
3. Enter: `www.simeonrubin.com` and `simeonrubin.com`
4. If you removed it from the old project, it should be available immediately
5. Vercel will automatically configure both domains

## Step 9: Verify Everything Works! 🎉

### 9.1 Test CMS Admin

1. Go to `https://cms.simeonrubin.com/admin`
2. Log in with your admin credentials
3. Check that all 9 projects are visible
4. Try editing a project
5. Upload a new test image

### 9.2 Test CMS API

1. Visit: `https://cms.simeonrubin.com/api/projects`
2. Should return JSON with all your projects
3. Check that images have proper URLs

### 9.3 Test Frontend

1. Visit: `https://www.simeonrubin.com`
2. **All your projects should be visible!** 🎊
3. Click on a project to see details
4. Verify images load correctly
5. Test theme switching
6. Test responsive design on mobile

### 9.4 Test Data Persistence

1. Add a new project in CMS admin
2. Publish it
3. Wait 60 seconds (ISR revalidation)
4. Refresh www.simeonrubin.com
5. New project should appear! ✨

### 9.5 Troubleshooting

**If projects don't show on frontend:**

- Check CMS API returns data: `https://cms.simeonrubin.com/api/projects`
- Verify `NEXT_PUBLIC_CMS_URL` is set correctly in frontend
- Check browser console for errors
- Wait 60 seconds for ISR to revalidate

**If images don't load:**

- Verify images uploaded to CMS media collection
- Check `next.config.ts` includes `cms.simeonrubin.com` in remote patterns
- Inspect image URLs in browser network tab

## Step 10: Cleanup & Next Steps

### 10.1 Secure Your Backups

```bash
# Your data is now in Postgres - you can archive the backup
cd /Users/simeonrubin/Desktop/Coding/portfolio-2025
zip -r data-backup-$(date +%Y%m%d).zip data-backup/
# Store this ZIP somewhere safe (external drive, cloud storage)
```

### 10.2 Optional: Remove Local Backup

After confirming everything works in production:

```bash
# Optional - only after verifying production works!
rm -rf data-backup/
```

### 10.3 Future Updates

For continuous deployment:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Both projects will auto-deploy! ✨

## Database Architecture

### Production (Vercel Postgres) ✅

Your deployed CMS uses **Vercel Postgres** for persistent data storage:

- ✅ **Data persists** across deployments
- ✅ **Free tier**: 256 MB storage (plenty for portfolios)
- ✅ **Automatic backups** (available in Vercel dashboard)
- ✅ **Zero config**: Works out of the box

### Local Development (SQLite)

Your local CMS continues to use **SQLite** for fast development:

- ⚡ **Fast**: No network latency
- 🔄 **Easy**: File-based, no setup needed
- 🧪 **Safe**: Changes don't affect production

### How It Works

The CMS config automatically detects the environment:

```typescript
// Production: POSTGRES_URL is set by Vercel → Uses Postgres
// Local: No POSTGRES_URL → Uses SQLite (file:./cms.db)
const databaseAdapter = process.env.POSTGRES_URL
  ? vercelPostgresAdapter({ ... })
  : sqliteAdapter({ ... })
```

This is already configured in `apps/cms/src/payload.config.ts`!

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
