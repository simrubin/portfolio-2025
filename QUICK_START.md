# Quick Start Guide

Get your CMS-powered portfolio running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or pnpm installed

## Setup Steps

### 1. Install Dependencies

```bash
# From the root directory
npm install

# Or install for each app separately
cd apps/cms && npm install
cd ../frontend && npm install
```

### 2. Configure CMS Environment

Create `apps/cms/.env`:

```env
DATABASE_URI=file:./cms.db
PAYLOAD_SECRET=your-secret-key-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Generate a secret:

```bash
openssl rand -base64 32
```

### 3. Configure Frontend Environment

Create `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_CMS_URL=http://localhost:3000
```

### 4. Start CMS (Terminal 1)

```bash
cd apps/cms
npm run dev
```

Runs at: http://localhost:3000
Admin: http://localhost:3000/admin

### 5. Start Frontend (Terminal 2)

```bash
cd apps/frontend
npm run dev
```

Runs at: http://localhost:3001

### 6. Create Admin User

1. Visit http://localhost:3000/admin
2. Fill in email and password
3. Click "Create"

### 7. Add Your First Project

1. In admin panel, click "Projects" → "Create New"
2. Fill in:
   - **Title**: Your project name
   - **Slug**: url-friendly-name
   - **Hero Image**: Upload an image
   - **Published At**: Select today's date
   - **Year**: Enter the year
3. Add a section:
   - **Section Title**: "Overview"
   - **Text Body**: Describe your project
   - **Add Media**: Upload images/videos
4. Click **"Publish"**

### 8. View on Frontend

1. Go to http://localhost:3001
2. Scroll to "Projects" section
3. See your project appear
4. Click it to view the detail page

## That's It! 🎉

You now have a working CMS-powered portfolio.

## Next Steps

- **Add More Projects**: Repeat step 7
- **Customize Styles**: Edit components in `apps/frontend/src/components/`
- **Deploy**: Follow [`DEPLOYMENT.md`](./DEPLOYMENT.md)

## Useful Commands

```bash
# CMS
npm run dev          # Start dev server
npm run build        # Build for production
npm run generate:types  # Regenerate TypeScript types

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
```

## File Structure

```
portfolio-2025/
├── apps/
│   ├── cms/              # Payload CMS (port 3000)
│   │   ├── src/
│   │   ├── public/media/ # Uploaded files
│   │   ├── cms.db        # Database
│   │   └── .env          # Config (create this)
│   │
│   └── frontend/         # Next.js (port 3001)
│       ├── src/
│       └── .env.local    # Config (create this)
│
└── Documentation files...
```

## Documentation Files

- 📖 **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - Full overview
- 📝 **[CMS_USAGE_GUIDE.md](./CMS_USAGE_GUIDE.md)** - How to use the CMS
- 🚀 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to Vercel
- ⚙️ **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment variables

## Troubleshooting

**CMS won't start?**

- Check `.env` file exists
- Verify `PAYLOAD_SECRET` is set

**Frontend shows no projects?**

- Projects must be **Published** (not Draft)
- Check `NEXT_PUBLIC_CMS_URL` is correct
- Verify CMS is running

**Images not loading?**

- Check `next.config.ts` remote patterns
- Ensure images uploaded successfully

**Need help?**

- Check the other documentation files
- Look at browser console for errors
- Check terminal for error messages

## Pro Tips

1. **Keep both terminals running** while developing
2. **Use Draft mode** while working on projects
3. **Publish** when ready to show on frontend
4. **Wait 60 seconds** after publishing for ISR to update
5. **Backup your database** (`cms.db`) periodically

Happy building! 🚀
