# Vercel Postgres Setup Guide

This guide will help you set up Vercel Postgres for your portfolio CMS, ensuring your project data persists across deployments.

## 🎯 Why Use Vercel Postgres?

- ✅ **Persistent Data**: Your projects and media won't be lost on deployment
- ✅ **Free Tier**: 256 MB storage, 60 hours compute/month (plenty for portfolio)
- ✅ **Zero Config**: Automatically integrates with Vercel deployments
- ✅ **Production Ready**: Reliable and scalable

## 📋 Prerequisites

- ✅ **Data Exported**: You've already run `node export-data.js` (9 projects + 81 media backed up)
- ✅ **Vercel Account**: You have access to Vercel dashboard
- ✅ **CMS Code Updated**: The CMS config now supports Postgres

## 🚀 Step-by-Step Setup

### Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Navigate to Storage Tab**:
   - Click on "Storage" in the top menu
   - Or go directly to: https://vercel.com/dashboard/stores

3. **Create New Database**:
   - Click "Create Database"
   - Select "Postgres"
   - Choose a name: `portfolio-cms-db`
   - Select region: Choose closest to your location
   - Click "Create"

### Step 2: Connect Database to Your CMS Project

1. **After database creation**, you'll see the database dashboard
2. **Click on "Connect Project"**
3. **Select your CMS project** (the one you'll create/already created)
4. **Vercel will automatically add environment variables**:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - And others...

✅ Your CMS is configured to automatically use Postgres when `POSTGRES_URL` is set!

### Step 3: Verify Environment Variables

Go to your CMS project → Settings → Environment Variables

You should now have:

```
# Existing variables
DATABASE_URI=file:./cms.db
PAYLOAD_SECRET=your-secret-here
NEXT_PUBLIC_SERVER_URL=https://cms.simeonrubin.com

# NEW - Auto-added by Vercel Postgres
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...
```

✅ The `DATABASE_URI` can stay - it's only used for local development

### Step 4: Deploy Your CMS

1. **Push your code to GitHub** (if you haven't):

   ```bash
   git add .
   git commit -m "Add Vercel Postgres support"
   git push origin main
   ```

2. **Vercel will auto-deploy** (if you have the project connected)
   - Or manually trigger a deployment from Vercel dashboard

3. **Wait for deployment to complete** (2-3 minutes)

### Step 5: Initialize Database Schema

After first deployment with Postgres:

1. **Go to your CMS admin**: https://cms.simeonrubin.com/admin
2. **Create your first admin user** (if prompted)
3. **Payload will automatically create all database tables** ✨

### Step 6: Import Your Projects

Now restore your 9 projects and 81 media files:

#### Option A: Use Import Script (Recommended)

```bash
cd /Users/simeonrubin/Desktop/Coding/portfolio-2025
node import-data.js
```

Follow the prompts:

- Enter CMS URL: `https://cms.simeonrubin.com`
- Enter your admin email
- Enter your admin password

The script will import all your projects!

#### Option B: Manual Upload

1. **Upload Media First**:
   - Go to https://cms.simeonrubin.com/admin
   - Navigate to "Media" collection
   - Upload images from your `data-backup/media-files/` folder

2. **Recreate Projects**:
   - Use your exported JSON (`data-backup/projects-export.json`) as reference
   - Manually recreate each project
   - Link the uploaded media files

### Step 7: Verify Everything Works

1. **Check Projects**: https://cms.simeonrubin.com/api/projects
   - Should return your projects as JSON

2. **Check Frontend**: https://www.simeonrubin.com
   - Your projects should appear!

3. **Test Admin Panel**: https://cms.simeonrubin.com/admin
   - Create a test project
   - Edit existing projects
   - Upload new media

## 🔄 How It Works

### Local Development (SQLite)

```bash
# No POSTGRES_URL set → Uses SQLite
DATABASE_URI=file:./cms.db
```

Your local CMS continues to use SQLite for fast development.

### Production (Vercel Postgres)

```bash
# POSTGRES_URL is set by Vercel → Uses Postgres
POSTGRES_URL=postgres://...
```

Your deployed CMS automatically uses Postgres for persistent storage.

## 📊 Database Management

### Viewing Your Data

**Option 1: Via Vercel Dashboard**

1. Go to Storage → Your Postgres database
2. Click "Data" tab
3. Browse tables: `projects`, `media`, `users`, etc.

**Option 2: Via SQL Client**
Use the connection string from environment variables with:

- TablePlus
- pgAdmin
- DBeaver

### Backing Up Your Data

```bash
# Export projects (anytime)
curl "https://cms.simeonrubin.com/api/projects?limit=200" > projects-backup.json

# Export media
curl "https://cms.simeonrubin.com/api/media?limit=500" > media-backup.json
```

## 💰 Cost & Limits (Free Tier)

- **Storage**: 256 MB (plenty for portfolio)
- **Compute**: 60 hours/month
- **Rows**: Up to 10,000
- **Data Transfer**: 256 MB/month

**Your usage estimate:**

- 9 projects ≈ 50 KB
- 81 media records ≈ 200 KB (just metadata, actual files in filesystem)
- Total: < 1 MB

✅ You'll stay well within free tier limits!

## 🔧 Troubleshooting

### Build Fails with Database Error

**Error**: `Cannot connect to database`
**Solution**:

1. Check that Postgres database is connected to project
2. Verify `POSTGRES_URL` environment variable is set
3. Redeploy

### Projects Not Showing After Import

**Error**: Projects imported but not visible on frontend
**Solution**:

1. Check project status is "published" not "draft"
2. Wait 60 seconds for ISR revalidation
3. Clear browser cache

### Media Images Not Loading

**Error**: Images return 404
**Solution**:

1. Media files need to be re-uploaded to production CMS
2. Your `data-backup/media-files/` folder has the originals
3. Upload via CMS admin panel or use a bulk upload script

### Migration from SQLite

**Error**: Want to migrate existing SQLite data to Postgres
**Solution**:

1. Export data from local SQLite (already done: `data-backup/`)
2. Deploy with Postgres
3. Import data using import script

## 📞 Need Help?

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Test API endpoints directly: `https://cms.simeonrubin.com/api/projects`

## ✨ Next Steps

After successful setup:

1. ✅ **Test creating a new project** via CMS admin
2. ✅ **Verify it appears on frontend**
3. ✅ **Add more projects** as needed
4. ✅ **Delete test data** from seed script (optional)
5. ✅ **Remove local backup files** (after confirming everything works)

---

🎉 **Congratulations!** Your portfolio now has a production-ready database that will persist your data forever!
