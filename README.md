# Simeon Rubin - Portfolio 2025

A modern, CMS-powered portfolio website built with Next.js and Payload CMS. This monorepo project features a beautiful, animated frontend with a headless CMS backend for easy content management.

**Live Site**: [www.simeonrubin.com](https://www.simeonrubin.com)  
**CMS Admin**: 

## Features

### Frontend Portfolio

- **Dynamic Project Showcase**: Projects dynamically loaded from CMS with rich content
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Theme**: Automatic theme switching with system preference detection
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Image Optimization**: Next.js Image component with zoom functionality
- **ISR (Incremental Static Regeneration)**: Fast performance with dynamic content updates

### CMS Backend

- **Headless CMS**: Full-featured Payload CMS for content management
- **Custom Project Collection**: Rich project data structure with sections and images
- **Media Management**: Upload and manage project images
- **Draft/Preview**: Save drafts and preview before publishing
- **User Authentication**: Secure admin panel with role-based access

## Structure

```
portfolio-2025/
├── apps/
│   ├── frontend/         # Next.js portfolio website
│   │   ├── src/
│   │   │   ├── app/      # App router pages
│   │   │   ├── components/
│   │   │   │   ├── hero-section.tsx
│   │   │   │   ├── projects-section.tsx
│   │   │   │   ├── experience-section.tsx
│   │   │   │   └── ui/   # Reusable UI components
│   │   │   └── lib/      # Utilities and helpers
│   │   └── public/       # Static assets
│   └── cms/              # Payload CMS backend
│       ├── src/
│       │   ├── collections/  # CMS collections (Projects, Media, etc.)
│       │   ├── blocks/       # Reusable content blocks
│       │   └── app/          # Next.js app for CMS
│       └── cms.db        # SQLite database (dev)
└── package.json          # Root workspace configuration
```

## Getting Started

### Prerequisites

- **Node.js**: 18.20.2+ or 20.9.0+
- **npm**: Comes with Node.js
- **Git**: For version control

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/portfolio-2025.git
cd portfolio-2025
```

2. **Install all dependencies**

```bash
npm install
```

This installs dependencies for both frontend and CMS workspaces.

3. **Set up environment variables**

Create `.env` file in `apps/cms/`:

```env
DATABASE_URI=file:./cms.db
PAYLOAD_SECRET=your-secret-key-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Generate a secure secret:

```bash
openssl rand -base64 32
```

Create `.env.local` file in `apps/frontend/`:

```env
NEXT_PUBLIC_CMS_URL=http://localhost:3000
```

4. **Run the applications**

Open two terminal windows:

**Terminal 1 - CMS:**

```bash
npm run dev:cms
```

CMS admin panel: `http://localhost:3000/admin`

> On first run, you'll be prompted to create an admin user.

**Terminal 2 - Frontend:**

```bash
npm run dev:frontend
```

Frontend site: `http://localhost:3001` (or next available port)

5. **Add your first project**

- Go to `http://localhost:3000/admin`
- Navigate to "Projects" collection
- Click "Create New"
- Fill in project details, add images, and publish!

## CMS Project Structure

The **Projects** collection in Payload CMS uses the following schema:

```typescript
{
  title: string;              // Project name (e.g., "Machine Eye")
  year: number;               // Year completed (e.g., 2024)
  newlyAdded?: boolean;       // Show "NEW" badge
  heroImage: Media;           // Main project image
  sections: [                 // Flexible content sections
    {
      sectionTitle: string;   // Section heading
      textBody: RichText;     // Formatted content
      images: [               // Image gallery
        {
          image: Media;
          caption?: string;
        }
      ]
    }
  ];
  status: 'draft' | 'published';
}
```

This flexible structure allows for:

- Multiple content sections per project
- Rich text formatting with headings, lists, links
- Image galleries with optional captions
- Draft mode for work-in-progress projects

## Tech Stack

### Frontend

- **Framework**: Next.js 15.5.4 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Type Safety**: TypeScript
- **Components**: Radix UI primitives

### CMS Backend

- **CMS**: Payload CMS 3.59.1
- **Framework**: Next.js 15.4.4
- **Database**: SQLite (dev), PostgreSQL/Vercel Postgres (production)
- **File Storage**: Local filesystem (dev), Vercel Blob (production)
- **Authentication**: Built-in Payload auth

### Development Tools

- **Monorepo**: npm workspaces
- **Linting**: ESLint
- **Type Checking**: TypeScript strict mode

## 🚢 Deployment

This project is deployed on Vercel as two separate applications:

- **Frontend**: www.simeonrubin.com
- **CMS**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy Commands

```bash
# Build both apps locally to test
npm run build:frontend
npm run build:cms

# Run production builds locally
npm run start:frontend
npm run start:cms
```

## Content Management

### Adding a New Project

1. Log in to CMS admin
2. Click "Projects" → "Create New"
3. Fill in the required fields:
   - Title
   - Year
   - Hero Image (main project image)
4. Add sections with content and images
5. Set status to "Published"
6. Save

Changes will appear on the frontend within 60 seconds (ISR revalidation).

### Managing Media

- Upload images in "Media" collection
- Supports: JPG, PNG, WebP, SVG
- Automatically optimized by Next.js Image component
- Alternative text for accessibility

## Development Scripts

```bash
# Root level commands
npm run dev:frontend         # Start frontend dev server
npm run dev:cms             # Start CMS dev server
npm run build:frontend      # Build frontend for production
npm run build:cms           # Build CMS for production

# Direct workspace commands
npm --workspace=apps/frontend run dev
npm --workspace=apps/cms run dev
```

## API Reference

### Fetching Projects

```typescript
// Fetch all published projects
const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/projects`);
const data = await response.json();
const projects = data.docs;

// Fetch single project by ID
const project = await fetch(
  `${process.env.NEXT_PUBLIC_CMS_URL}/api/projects/${id}`
);
```

## Contact

**Simeon Rubin**

- Website: [www.simeonrubin.com](https://www.simeonrubin.com)
- GitHub: [@simeonrubin](https://github.com/simeonrubin)

---

Built using Next.js and Payload CMS
