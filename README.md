# Portfolio 2025 - Monorepo

This is a monorepo containing a Next.js portfolio frontend and a Payload CMS backend for managing project pages.

## Structure

```
portfolio-2025/
├── apps/
│   ├── frontend/    # Next.js portfolio website
│   └── cms/         # Payload CMS backend
└── package.json     # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- npm (comes with Node.js)

### Installation

From the root directory, install all dependencies:

```bash
npm install
```

This will install dependencies for both the frontend and CMS workspaces.

### Running the Applications

#### Development Mode

To run both applications in development mode, open two terminal windows:

**Terminal 1 - Frontend (Next.js):**
```bash
npm run dev:frontend
```
The frontend will be available at `http://localhost:3000`

**Terminal 2 - CMS (Payload):**
```bash
npm run dev:cms
```
The CMS admin panel will be available at `http://localhost:3000/admin` (or a different port if 3000 is taken)

> **Note:** On first run, you'll need to create an admin user for the CMS.

### Project Collection

The CMS includes a custom **Projects** collection with the following fields:

- **Title** (required): Project name
- **Year** (required): Year of the project
- **Newly Added** (optional): Badge to mark new projects
- **Sections** (array): Each section contains:
  - **Section Title** (required)
  - **Text Body** (required, rich text)
  - **Images** (array): Each image has:
    - **Image** (required, upload)
    - **Caption** (optional)

### Environment Variables

#### CMS (`apps/cms/.env`)

Create a `.env` file in `apps/cms/` with:

```env
DATABASE_URI=file:./database.db
PAYLOAD_SECRET=your-secret-key-here
```

Generate a secure secret key for `PAYLOAD_SECRET`:
```bash
openssl rand -base64 32
```

### Building for Production

```bash
# Build frontend
npm --workspace=apps/frontend run build

# Build CMS
npm --workspace=apps/cms run build
```

### Tech Stack

**Frontend:**
- Next.js 15.5.4
- React 19
- TypeScript
- Tailwind CSS 4

**CMS:**
- Payload CMS 3.59.1
- Next.js 15.4.4
- React 19
- SQLite (development database)
- TypeScript

## Fetching Projects in Frontend

To fetch projects from the CMS in your Next.js frontend, you can use the Payload REST API:

```typescript
// Example: Fetch all projects
const response = await fetch('http://localhost:3000/api/projects')
const data = await response.json()
const projects = data.docs
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [React Documentation](https://react.dev)
