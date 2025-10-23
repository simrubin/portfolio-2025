const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { Pool } = require("pg");
const readline = require("readline");

// Configuration
const SQLITE_DB_PATH = "./apps/cms/cms.db";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

let POSTGRES_URL;

// Initialize connections
const sqliteDb = new sqlite3.Database(SQLITE_DB_PATH);
let pgPool;

// ID mapping storage
const idMappings = {
  media: new Map(),
  projects: new Map(),
  projects_sections: new Map(),
};

async function migrateData() {
  console.log(
    "🚀 Starting direct database migration from SQLite to Postgres...\n"
  );

  // Get Postgres URL from user
  POSTGRES_URL = await question(
    "Enter your Vercel Postgres URL (from Vercel dashboard → Storage → Postgres → Connect): "
  );

  if (!POSTGRES_URL.trim()) {
    console.log("❌ Postgres URL is required");
    process.exit(1);
  }

  // Initialize Postgres connection
  pgPool = new Pool({ connectionString: POSTGRES_URL.trim() });

  try {
    const pgClient = await pgPool.connect();

    try {
      // Step 1: Migrate media files
      console.log("📤 Step 1: Migrating media files...");
      await migrateMedia(sqliteDb, pgClient);

      // Step 2: Migrate projects
      console.log("\n📦 Step 2: Migrating projects...");
      await migrateProjects(sqliteDb, pgClient);

      // Step 3: Migrate project sections
      console.log("\n📝 Step 3: Migrating project sections...");
      await migrateProjectSections(sqliteDb, pgClient);

      // Step 4: Migrate project section media
      console.log("\n🖼️  Step 4: Migrating project section media...");
      await migrateProjectSectionMedia(sqliteDb, pgClient);

      console.log("\n✅ Migration completed successfully!");
      console.log(`📊 Summary:`);
      console.log(`   - Media files: ${idMappings.media.size}`);
      console.log(`   - Projects: ${idMappings.projects.size}`);
      console.log(
        `   - Project sections: ${idMappings.projects_sections.size}`
      );
    } finally {
      pgClient.release();
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    sqliteDb.close();
    if (pgPool) {
      await pgPool.end();
    }
    rl.close();
  }
}

async function migrateMedia(sqliteDb, pgClient) {
  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM media ORDER BY id", [], async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      console.log(`   Found ${rows.length} media files to migrate`);

      for (const media of rows) {
        try {
          // Generate new UUID for the media
          const newId = generateUUID();
          idMappings.media.set(media.id, newId);

          // Insert into Postgres (only columns that exist)
          await pgClient.query(
            `
            INSERT INTO media (
              id, alt, updated_at, created_at, url, thumbnail_u_r_l,
              filename, mime_type, filesize, width, height, focal_x, focal_y
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            )
          `,
            [
              newId, // id
              media.alt, // alt
              media.updated_at, // updated_at
              media.created_at, // created_at
              media.url, // url
              media.thumbnail_u_r_l, // thumbnail_u_r_l
              media.filename, // filename
              media.mime_type, // mime_type
              media.filesize, // filesize
              media.width, // width
              media.height, // height
              media.focal_x, // focal_x
              media.focal_y, // focal_y
            ]
          );

          console.log(
            `   ✅ Migrated media: ${media.filename} (${media.id} → ${newId})`
          );
        } catch (error) {
          console.error(
            `   ❌ Failed to migrate media ${media.filename}:`,
            error.message
          );
        }
      }

      resolve();
    });
  });
}

async function migrateProjects(sqliteDb, pgClient) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(
      "SELECT * FROM projects ORDER BY id",
      [],
      async (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        console.log(`   Found ${rows.length} projects to migrate`);

        for (const project of rows) {
          try {
            // Generate new UUID for the project
            const newId = generateUUID();
            idMappings.projects.set(project.id, newId);

            // Map hero image ID
            const heroImageId = project.hero_image_id
              ? idMappings.media.get(project.hero_image_id)
              : null;

            // Insert into Postgres
            await pgClient.query(
              `
            INSERT INTO projects (
              id, title, slug, hero_image_id, published_at, year, newly_added,
              updated_at, created_at, _status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `,
              [
                newId, // id
                project.title, // title
                project.slug, // slug
                heroImageId, // hero_image_id (mapped)
                project.published_at, // published_at
                project.year, // year
                project.newly_added === 1, // newly_added (convert to boolean)
                project.updated_at, // updated_at
                project.created_at, // created_at
                project._status || "published", // _status
              ]
            );

            console.log(
              `   ✅ Migrated project: ${project.title} (${project.id} → ${newId})`
            );
          } catch (error) {
            console.error(
              `   ❌ Failed to migrate project ${project.title}:`,
              error.message
            );
          }
        }

        resolve();
      }
    );
  });
}

async function migrateProjectSections(sqliteDb, pgClient) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(
      "SELECT * FROM projects_sections ORDER BY _parent_id, _order",
      [],
      async (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        console.log(`   Found ${rows.length} project sections to migrate`);

        for (const section of rows) {
          try {
            // Generate new UUID for the section
            const newId = generateUUID();
            idMappings.projects_sections.set(section.id, newId);

            // Map parent project ID
            const parentProjectId = idMappings.projects.get(section._parent_id);
            if (!parentProjectId) {
              console.log(
                `   ⚠️  Skipping section ${section.id} - parent project not found`
              );
              continue;
            }

            // Insert into Postgres
            await pgClient.query(
              `
            INSERT INTO projects_sections (
              _order, _parent_id, id, section_title, text_body
            ) VALUES ($1, $2, $3, $4, $5)
          `,
              [
                section._order, // _order
                parentProjectId, // _parent_id (mapped)
                newId, // id
                section.section_title, // section_title
                section.text_body, // text_body
              ]
            );

            console.log(
              `   ✅ Migrated section: ${section.section_title || "Untitled"} (${section.id} → ${newId})`
            );
          } catch (error) {
            console.error(
              `   ❌ Failed to migrate section ${section.id}:`,
              error.message
            );
          }
        }

        resolve();
      }
    );
  });
}

async function migrateProjectSectionMedia(sqliteDb, pgClient) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(
      "SELECT * FROM projects_sections_media ORDER BY _parent_id, _order",
      [],
      async (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        console.log(`   Found ${rows.length} project section media to migrate`);

        for (const media of rows) {
          try {
            // Generate new UUID for the media item
            const newId = generateUUID();

            // Map parent section ID and media item ID
            const parentSectionId = idMappings.projects_sections.get(
              media._parent_id
            );
            const mediaItemId = media.media_item_id
              ? idMappings.media.get(media.media_item_id)
              : null;

            if (!parentSectionId) {
              console.log(
                `   ⚠️  Skipping section media ${media.id} - parent section not found`
              );
              continue;
            }

            // Insert into Postgres
            await pgClient.query(
              `
            INSERT INTO projects_sections_media (
              _order, _parent_id, id, media_item_id, caption
            ) VALUES ($1, $2, $3, $4, $5)
          `,
              [
                media._order, // _order
                parentSectionId, // _parent_id (mapped)
                newId, // id
                mediaItemId, // media_item_id (mapped)
                media.caption, // caption
              ]
            );

            console.log(
              `   ✅ Migrated section media: ${media.caption || "Untitled"} (${media.id} → ${newId})`
            );
          } catch (error) {
            console.error(
              `   ❌ Failed to migrate section media ${media.id}:`,
              error.message
            );
          }
        }

        resolve();
      }
    );
  });
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Run the migration
migrateData().catch(console.error);
