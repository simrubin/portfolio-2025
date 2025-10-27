# Frontend Deployment Guide

## ✅ Local Development Setup Complete

Your frontend is now connected to the local CMS:

- **Frontend:** `http://localhost:3001`
- **CMS:** `http://localhost:3000`

## Production Deployment to www.simeonrubin.com

### Step 1: Verify Local Works

Visit `http://localhost:3001` and check:

- [ ] Homepage loads
- [ ] Projects section displays all 9 projects
- [ ] Project images load
- [ ] Can click into individual projects
- [ ] Project detail pages load with all content

### Step 2: Push Frontend to GitHub

```bash
cd /Users/simeonrubin/Desktop/Coding/portfolio-2025/apps/frontend

# Add and commit
git add .
git commit -m "Connect frontend to portfolio-cms production"
git push
```

### Step 3: Deploy to Vercel

#### Option A: New Vercel Project (Recommended)

1. Go to: https://vercel.com/new
2. Import your repository
3. **Root Directory:** `apps/frontend`
4. **Framework Preset:** Next.js
5. **Environment Variables:**
   ```
   NEXT_PUBLIC_CMS_URL=https://portfolio-cms-mocha-ten.vercel.app
   ```
6. Click "Deploy"

#### Option B: Update Existing Project

If you already have a Vercel project at www.simeonrubin.com:

1. Go to your project settings on Vercel
2. **Settings** → **General** → **Root Directory**
   - Change to: `apps/frontend`
3. **Settings** → **Environment Variables**
   - Add: `NEXT_PUBLIC_CMS_URL=https://portfolio-cms-mocha-ten.vercel.app`
4. **Deployments** → Redeploy latest

### Step 4: Configure Custom Domain

1. **Vercel Dashboard** → Your project → **Settings** → **Domains**
2. Add domain: `www.simeonrubin.com`
3. Follow Vercel's DNS instructions to point your domain

### Step 5: Verify Production

Visit `https://www.simeonrubin.com` and check:

- [ ] All 9 projects display
- [ ] Images load from Vercel Blob
- [ ] Project detail pages work
- [ ] Navigation works
- [ ] Theme switcher works

## Environment Variables Summary

### Local Development (`.env.local`)

```bash
NEXT_PUBLIC_CMS_URL=http://localhost:3000
```

### Production (Vercel)

```bash
NEXT_PUBLIC_CMS_URL=https://portfolio-cms-mocha-ten.vercel.app
```

## Project Structure

```
apps/
├── frontend/              ← Your Next.js frontend
│   ├── src/
│   │   ├── app/          ← Pages
│   │   ├── components/   ← React components
│   │   ├── lib/
│   │   │   └── payload.ts ← CMS API functions
│   │   └── types/
│   │       └── payload.ts ← TypeScript types
│   ├── .env.local        ← Local CMS URL
│   └── .env              ← Production CMS URL
│
└── portfolio-cms/         ← Your Payload CMS
    └── (already deployed to Vercel)
```

## API Endpoints Used

The frontend fetches data from these CMS endpoints:

- `GET /api/projects` - List all projects
- `GET /api/projects?where[slug][equals]=<slug>` - Get project by slug
- `GET /api/media/file/<filename>` - Get media files

All media is served from Vercel Blob in production.

## Troubleshooting

### Projects Not Loading

Check browser console for errors:

```
Failed to fetch projects: 404
```

→ Verify `NEXT_PUBLIC_CMS_URL` is correct

### Images Not Loading

Check if images are trying to load from:

- ✅ `https://[hash].public.blob.vercel-storage.com/...` (correct)
- ❌ `http://localhost:3000/api/media/...` (wrong in production)

### CORS Errors

If you see CORS errors, the CMS needs to allow your frontend domain. This should already be configured in `@portfolio-cms/payload.config.ts`.

## Next Steps After Deployment

1. **Test thoroughly** on production
2. **Set up analytics** (optional)
3. **Configure SEO** (meta tags, sitemap)
4. **Set up monitoring** (Vercel Analytics)

## Rollback Plan

If issues occur:

1. Revert domain to previous deployment in Vercel
2. Debug issues in staging/preview deployment
3. Redeploy when fixed

---

**Current Status:**

- ✅ Local frontend connected to local CMS
- ✅ Production CMS live with all data
- ⏳ Ready to deploy frontend to production
