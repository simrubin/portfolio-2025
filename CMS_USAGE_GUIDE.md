# CMS Usage Guide

This guide explains how to use your Payload CMS to manage project pages for your portfolio.

## Getting Started

### 1. Start the CMS Locally

```bash
cd apps/cms
npm run dev
```

The CMS will start at `http://localhost:3000`

### 2. Access the Admin Panel

Open your browser and go to: `http://localhost:3000/admin`

### 3. Create Your First Admin User

If this is your first time, you'll be prompted to create an admin account:

- Email: your-email@example.com
- Password: (choose a secure password)

## Adding a New Project

### Step 1: Navigate to Projects

1. Log into the admin panel
2. Click on "Projects" in the left sidebar
3. Click "Create New" button

### Step 2: Fill in Project Details

#### Required Fields:

**Title**

- The name of your project (e.g., "Matilda Demo")

**Slug**

- URL-friendly version (e.g., "matilda-demo")
- This will be used in the URL: `/projects/matilda-demo`
- Use lowercase, hyphens instead of spaces
- Must be unique

**Hero Image**

- Click "Select Image" or drag and drop
- This image appears on your homepage and at the top of the project page
- Recommended size: 1920x1080 or similar aspect ratio
- Supports: JPG, PNG, WebP

**Published At**

- The date you want to show for this project
- Used for sorting projects (newest first)

**Year**

- The year of the project (for display, e.g., 2025)

#### Optional Fields:

**Newly Added**

- Check this box if you want to mark it as new
- You can use this for filtering or badges (currently stored, not displayed)

### Step 3: Add Content Sections

Projects are organized into sections. Each section has:

#### Section Title

- A heading for this part of the project (e.g., "Overview", "Process", "Results")

#### Text Body (Rich Text)

- Full rich text editor with formatting options:
  - **Bold**, _Italic_, Underline
  - Headings (H1, H2, H3, etc.)
  - Bullet lists and numbered lists
  - Blockquotes
  - Links
  - And more!

#### Images & Videos

- Click "Add Item" to add media to this section
- Each media item has:
  - **Media Item**: Upload image or video
  - **Caption**: Optional caption text

**Supported Image Formats:**

- JPG, PNG, WebP, GIF

**Supported Video Formats:**

- MP4, WebM, MOV

**Tips for Media:**

- Images are automatically optimized and resized
- Videos should be compressed before upload (keep file size reasonable)
- You can add multiple images/videos per section

### Step 4: Save and Publish

1. **Save Draft**: Saves your work without publishing
2. **Save**: Saves as draft if in draft mode
3. **Publish**: Makes the project visible on your frontend

The project must be **Published** to appear on your website.

## Editing Existing Projects

1. Go to "Projects" in the admin panel
2. Click on the project you want to edit
3. Make your changes
4. Click "Save" or "Publish"

## Deleting Projects

1. Go to "Projects" in the admin panel
2. Click on the project
3. Click "Delete" at the top
4. Confirm deletion

## Media Library

### Uploading Media

**Method 1: During Project Creation**

- Upload directly when adding hero images or section media

**Method 2: Media Collection**

1. Click "Media" in the left sidebar
2. Click "Create New"
3. Upload your file
4. Add optional alt text and caption
5. Save

### Managing Media

All uploaded media is stored in `apps/cms/public/media/`

**Tips:**

- Use descriptive filenames
- Add alt text for accessibility
- Captions support rich text formatting

## Project Display on Frontend

### Homepage (projects-section)

- Shows all published projects
- Displays hero image
- Shows title and year on hover
- Sorted by published date (newest first)
- Clicking a project navigates to its detail page

### Project Detail Page (`/projects/[slug]`)

- Hero image at the top
- Title and formatted date
- All content sections in order
- Images and videos with captions
- Back button to return to homepage

## Example Project Structure

```
Project: "Matilda Demo"
├── Title: Matilda Demo
├── Slug: matilda-demo
├── Hero Image: matilda-hero.jpg
├── Published At: 2025-01-15
├── Year: 2025
└── Sections:
    ├── Section 1: "Overview"
    │   ├── Text: "Matilda is a..."
    │   └── Media:
    │       ├── Image: screenshot-1.jpg
    │       └── Caption: "Landing page design"
    ├── Section 2: "Features"
    │   ├── Text: "Key features include..."
    │   └── Media:
    │       ├── Video: demo.mp4
    │       └── Caption: "Product demo"
    └── Section 3: "Results"
        ├── Text: "The project achieved..."
        └── Media:
            ├── Image: results-1.jpg
            └── Caption: "Analytics dashboard"
```

## Tips & Best Practices

### Content Organization

1. **Use Clear Section Titles**: Help readers navigate your project
2. **Mix Text and Media**: Don't just dump images, explain them
3. **Tell a Story**: Overview → Process → Results works well
4. **Keep Sections Focused**: One idea per section

### Images

1. **Optimize Before Upload**: Use tools like TinyPNG or Squoosh
2. **Consistent Aspect Ratios**: Makes your gallery look professional
3. **High Quality**: Your portfolio should showcase your best work
4. **Alt Text**: Describe the image for accessibility

### Videos

1. **Keep Under 50MB**: Large files slow down loading
2. **Use MP4**: Best browser compatibility
3. **Include Poster Frame**: First frame should be meaningful
4. **Short Clips**: 30-60 seconds works best for demos

### Writing

1. **Be Concise**: People scan more than they read
2. **Use Formatting**: Break up text with headings and lists
3. **Highlight Impact**: What problem did you solve?
4. **Show Your Role**: What did YOU do?

## Workflow for Adding Projects from Existing Work

If you have existing projects (like the current static ones), here's how to migrate them:

1. **Prepare Assets**
   - Gather all images for each project
   - Name files descriptively (e.g., `matilda-hero.jpg`, `matilda-features.jpg`)

2. **Create Project in CMS**
   - Start with title and slug
   - Upload hero image
   - Set the date and year

3. **Add Content**
   - Write sections describing the project
   - Upload and caption all images
   - Add any videos if available

4. **Publish**
   - Review in draft mode
   - When ready, click "Publish"

5. **Preview**
   - Visit your frontend
   - Click the project to see the detail page
   - Make adjustments as needed

## Frontend Updates

Changes in the CMS appear on the frontend within 60 seconds (due to ISR - Incremental Static Regeneration):

- First visitor after 60 seconds triggers a rebuild
- Subsequent visitors see the cached version
- Fast and efficient!

## Need Help?

### Common Issues

**Project not showing on frontend:**

- Make sure it's Published (not a draft)
- Check that published date isn't in the future
- Wait 60 seconds for ISR to regenerate

**Images not displaying:**

- Verify the image uploaded successfully
- Check file format is supported
- Make sure the CMS is running if testing locally

**Rich text not rendering:**

- The frontend supports most Lexical formats
- Try simpler formatting if something looks wrong
- Check browser console for errors

## Data Management

### Backup Your Database

The CMS uses SQLite database at `apps/cms/cms.db`

To backup:

```bash
cp apps/cms/cms.db apps/cms/cms.db.backup
```

### Export Projects (via API)

You can query the API directly:

```bash
curl http://localhost:3000/api/projects
```

This returns all projects in JSON format.

## Next Steps

1. ✅ Add your first project
2. ✅ Upload some media
3. ✅ Preview on frontend
4. ✅ Deploy to Vercel (see DEPLOYMENT.md)
5. ✅ Share your portfolio!

Happy content managing! 🚀
