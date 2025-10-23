#!/usr/bin/env node

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// Database path
const dbPath = "./apps/cms/cms.db";

// Ensure data-backup directory exists
const backupDir = "./data-backup";
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log("🔄 Starting comprehensive SQLite data export...");

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to SQLite database");
});

// Export projects with full data including sections
function exportProjects() {
  return new Promise((resolve, reject) => {
    console.log("📦 Exporting projects with sections...");

    const query = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.hero_image_id,
        p.published_at,
        p.year,
        p.newly_added,
        p._status,
        p.created_at,
        p.updated_at,
        s.id as section_id,
        s.section_title,
        s.text_body
      FROM projects p
      LEFT JOIN projects_sections s ON p.id = s._parent_id
      ORDER BY p.published_at DESC, s._order ASC
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      console.log(`📊 Found ${rows.length} project-section records`);

      // Group sections by project
      const projectsMap = new Map();

      rows.forEach((row) => {
        const projectId = row.id;

        if (!projectsMap.has(projectId)) {
          projectsMap.set(projectId, {
            id: row.id,
            title: row.title,
            slug: row.slug,
            hero_image_id: row.hero_image_id,
            published_at: row.published_at,
            year: row.year,
            newly_added: row.newly_added,
            _status: row._status,
            created_at: row.created_at,
            updated_at: row.updated_at,
            sections: [],
          });
        }

        if (row.section_id) {
          projectsMap.get(projectId).sections.push({
            id: row.section_id,
            section_title: row.section_title,
            text_body: row.text_body,
          });
        }
      });

      const projects = Array.from(projectsMap.values());
      console.log(`📊 Found ${projects.length} projects with sections`);

      // Save to JSON file
      const projectsData = {
        exportedAt: new Date().toISOString(),
        totalProjects: projects.length,
        projects: projects,
      };

      const filePath = path.join(backupDir, "projects-full-export.json");
      fs.writeFileSync(filePath, JSON.stringify(projectsData, null, 2));
      console.log(`✅ Projects with sections exported to ${filePath}`);

      resolve(projects);
    });
  });
}

// Export media records
function exportMedia() {
  return new Promise((resolve, reject) => {
    console.log("📦 Exporting media records...");

    const query = `
      SELECT 
        id,
        alt,
        caption,
        url,
        thumbnail_u_r_l,
        filename,
        mime_type,
        filesize,
        width,
        height,
        focal_x,
        focal_y,
        sizes_thumbnail_url,
        sizes_thumbnail_width,
        sizes_thumbnail_height,
        sizes_thumbnail_mime_type,
        sizes_thumbnail_filesize,
        sizes_thumbnail_filename,
        sizes_square_url,
        sizes_square_width,
        sizes_square_height,
        sizes_square_mime_type,
        sizes_square_filesize,
        sizes_square_filename,
        sizes_small_url,
        sizes_small_width,
        sizes_small_height,
        sizes_small_mime_type,
        sizes_small_filesize,
        sizes_small_filename,
        sizes_medium_url,
        sizes_medium_width,
        sizes_medium_height,
        sizes_medium_mime_type,
        sizes_medium_filesize,
        sizes_medium_filename,
        sizes_large_url,
        sizes_large_width,
        sizes_large_height,
        sizes_large_mime_type,
        sizes_large_filesize,
        sizes_large_filename,
        sizes_xlarge_url,
        sizes_xlarge_width,
        sizes_xlarge_height,
        sizes_xlarge_mime_type,
        sizes_xlarge_filesize,
        sizes_xlarge_filename,
        sizes_og_url,
        sizes_og_width,
        sizes_og_height,
        sizes_og_mime_type,
        sizes_og_filesize,
        sizes_og_filename,
        created_at,
        updated_at
      FROM media
      ORDER BY created_at DESC
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      console.log(`📊 Found ${rows.length} media records`);

      // Save to JSON file
      const mediaData = {
        exportedAt: new Date().toISOString(),
        totalMedia: rows.length,
        media: rows,
      };

      const filePath = path.join(backupDir, "media-full-export.json");
      fs.writeFileSync(filePath, JSON.stringify(mediaData, null, 2));
      console.log(`✅ Media records exported to ${filePath}`);

      resolve(rows);
    });
  });
}

// Copy media files
function copyMediaFiles() {
  return new Promise((resolve, reject) => {
    console.log("📁 Copying media files...");

    const sourceDir = "./apps/cms/public/media";
    const targetDir = path.join(backupDir, "media-files");

    if (!fs.existsSync(sourceDir)) {
      console.log("⚠️  Source media directory does not exist");
      resolve();
      return;
    }

    // Create target directory
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copy all files from source to target
    try {
      const files = fs.readdirSync(sourceDir);
      let copiedCount = 0;

      files.forEach((file) => {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);

        if (fs.statSync(sourcePath).isFile()) {
          fs.copyFileSync(sourcePath, targetPath);
          copiedCount++;
        }
      });

      console.log(`✅ Copied ${copiedCount} media files to ${targetDir}`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Main export process
async function runExport() {
  try {
    console.log("🚀 Starting comprehensive data export...\n");

    // Export projects
    const projects = await exportProjects();
    console.log("");

    // Export media records
    const media = await exportMedia();
    console.log("");

    // Copy media files
    await copyMediaFiles();
    console.log("");

    // Summary
    console.log("📋 Export Summary:");
    console.log(`   • Projects: ${projects.length}`);
    console.log(`   • Media records: ${media.length}`);
    console.log(
      `   • Media files: Copied to ${path.join(backupDir, "media-files")}`
    );
    console.log(`   • Backup directory: ${backupDir}`);
    console.log("");
    console.log("✅ Export completed successfully!");
  } catch (error) {
    console.error("❌ Export failed:", error.message);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) {
        console.error("❌ Error closing database:", err.message);
      } else {
        console.log("🔒 Database connection closed");
      }
    });
  }
}

// Run the export
runExport();
