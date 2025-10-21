/**
 * Export Projects and Media from Local Payload CMS
 * Run this while your local CMS is running: node export-data.js
 */

const fs = require("fs");
const path = require("path");

const CMS_URL = "http://localhost:3000";

async function exportData() {
  console.log("🚀 Starting data export from local CMS...\n");

  try {
    // Export Projects
    console.log("📦 Exporting projects...");
    const projectsResponse = await fetch(
      `${CMS_URL}/api/projects?limit=200&depth=3`
    );

    if (!projectsResponse.ok) {
      throw new Error(
        `Failed to fetch projects: ${projectsResponse.status} ${projectsResponse.statusText}`
      );
    }

    const projectsData = await projectsResponse.json();
    const projectsFile = path.join(
      __dirname,
      "data-backup",
      "projects-export.json"
    );

    // Create backup directory
    if (!fs.existsSync(path.join(__dirname, "data-backup"))) {
      fs.mkdirSync(path.join(__dirname, "data-backup"));
    }

    fs.writeFileSync(projectsFile, JSON.stringify(projectsData, null, 2));
    console.log(
      `✅ Exported ${projectsData.docs.length} projects to: ${projectsFile}\n`
    );

    // Export Media
    console.log("🖼️  Exporting media...");
    const mediaResponse = await fetch(`${CMS_URL}/api/media?limit=500&depth=1`);

    if (!mediaResponse.ok) {
      throw new Error(
        `Failed to fetch media: ${mediaResponse.status} ${mediaResponse.statusText}`
      );
    }

    const mediaData = await mediaResponse.json();
    const mediaFile = path.join(__dirname, "data-backup", "media-export.json");

    fs.writeFileSync(mediaFile, JSON.stringify(mediaData, null, 2));
    console.log(
      `✅ Exported ${mediaData.docs.length} media files to: ${mediaFile}\n`
    );

    // Summary
    console.log("📊 Export Summary:");
    console.log(`   - Projects: ${projectsData.docs.length}`);
    console.log(`   - Media files: ${mediaData.docs.length}`);
    console.log(
      "\n💾 Your data has been backed up to the ./data-backup folder"
    );
    console.log("\n⚠️  IMPORTANT: Also backup your media files manually:");
    console.log("   Copy: apps/cms/public/media → data-backup/media-files");
    console.log("\n✨ You can now safely deploy with Vercel Postgres!");
  } catch (error) {
    console.error("\n❌ Error exporting data:", error.message);
    console.error("\n💡 Make sure your local CMS is running: npm run dev:cms");
    process.exit(1);
  }
}

exportData();
