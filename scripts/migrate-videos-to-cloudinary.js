#!/usr/bin/env node

/**
 * SAFE Video Migration Script - Vercel Blob → Cloudinary
 */

import { list } from '@vercel/blob';
import { v2 as cloudinary } from 'cloudinary';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../apps/portfolio-cms/.env.local') });
dotenv.config({ path: path.join(__dirname, '../apps/portfolio-cms/.env') });

// Configuration
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const POSTGRES_URL = process.env.POSTGRES_URL;
const DRY_RUN = process.argv.includes('--dry-run');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create backup directory
const BACKUP_DIR = path.join(__dirname, '../video-migration-backup');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('🎬 Video Migration Script - Vercel Blob → Cloudinary\n');

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made\n');
}

// Validate environment
function validateEnvironment() {
  const missing = [];
  
  if (!BLOB_TOKEN) missing.push('BLOB_READ_WRITE_TOKEN');
  if (!POSTGRES_URL) missing.push('POSTGRES_URL');
  if (!process.env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!process.env.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
  if (!process.env.CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET');
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease add these to apps/portfolio-cms/.env.local');
    process.exit(1);
  }
  
  console.log('✅ Environment validated\n');
}

// Get video files from Vercel Blob
async function getVideoBlobs() {
  console.log('📦 Fetching videos from Vercel Blob...');
  
  const { blobs } = await list({ token: BLOB_TOKEN });
  const videos = blobs.filter(blob => 
    blob.pathname.match(/\.(mp4|mov|webm|avi|mkv)$/i)
  );
  
  console.log(`   Found ${videos.length} video files\n`);
  return videos;
}

// Download video to local backup
async function downloadVideo(blob) {
  const fileName = path.basename(blob.pathname);
  const filePath = path.join(BACKUP_DIR, fileName);
  
  // Skip if already downloaded
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > 1000) { // More than 1KB means it's a real video
      console.log(`   ⏭️  Skipping ${fileName} (already backed up)`);
      return filePath;
    } else {
      // Remove corrupted file
      fs.unlinkSync(filePath);
    }
  }
  
  console.log(`   ⬇️  Downloading ${fileName} (${(blob.size / 1024 / 1024).toFixed(2)} MB)...`);
  
  const response = await fetch(blob.url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  fs.writeFileSync(filePath, buffer);
  
  // Verify download
  const stats = fs.statSync(filePath);
  if (stats.size < 1000) {
    const content = fs.readFileSync(filePath, 'utf8');
    throw new Error(`Download failed: ${content}`);
  }
  
  console.log(`   ✅ Backed up to: ${filePath}`);
  return filePath;
}

// Upload video to Cloudinary
async function uploadToCloudinary(filePath, originalUrl) {
  const fileName = path.basename(filePath, path.extname(filePath));
  
  console.log(`   ☁️  Uploading ${fileName} to Cloudinary...`);
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      public_id: `portfolio-videos/${fileName}`,
      folder: 'portfolio-videos',
      overwrite: false,
    });
    
    console.log(`   ✅ Uploaded: ${result.secure_url}`);
    return result;
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      console.log(`   ℹ️  Video already exists in Cloudinary, fetching URL...`);
      const existing = await cloudinary.api.resource(`portfolio-videos/${fileName}`, {
        resource_type: 'video'
      });
      return existing;
    }
    throw error;
  }
}

// Get database connection
async function getDbConnection() {
  const { default: postgres } = await import('postgres');
  return postgres(POSTGRES_URL);
}

// Update media record in database
async function updateMediaRecord(sql, originalUrl, cloudinaryUrl, cloudinaryData) {
  // Find media record by URL
  const records = await sql`
    SELECT id, url, filename FROM media WHERE url = ${originalUrl}
  `;
  
  if (records.length === 0) {
    console.log(`   ⚠️  No database record found for ${originalUrl}`);
    return null;
  }
  
  const record = records[0];
  
  if (DRY_RUN) {
    console.log(`   🔍 Would update record ${record.id}: ${originalUrl} → ${cloudinaryUrl}`);
    return { id: record.id, old_url: originalUrl, new_url: cloudinaryUrl };
  }
  
  await sql`
    UPDATE media 
    SET 
      url = ${cloudinaryUrl},
      filename = ${cloudinaryData.public_id}
    WHERE id = ${record.id}
  `;
  
  console.log(`   ✅ Updated database record ${record.id}`);
  return { id: record.id, old_url: originalUrl, new_url: cloudinaryUrl };
}

// Create rollback script
function createRollbackScript(changes) {
  const rollbackPath = path.join(BACKUP_DIR, 'ROLLBACK.sql');
  
  let sql = '-- ROLLBACK Script\n\n';
  changes.forEach(change => {
    sql += `UPDATE media SET url = '${change.old_url}' WHERE id = ${change.id};\n`;
  });
  
  fs.writeFileSync(rollbackPath, sql);
  console.log(`\n📝 Rollback script created: ${rollbackPath}`);
}

// Main migration function
async function migrate() {
  try {
    validateEnvironment();
    
    const videoBlobs = await getVideoBlobs();
    
    if (videoBlobs.length === 0) {
      console.log('✨ No videos found to migrate!');
      return;
    }
    
    console.log('📥 Step 1: Downloading videos (creating backup)...\n');
    const migrations = [];
    
    for (const blob of videoBlobs) {
      console.log(`\n🎬 Processing: ${blob.pathname}`);
      
      try {
        const localPath = await downloadVideo(blob);
        
        if (!DRY_RUN) {
          const cloudinaryResult = await uploadToCloudinary(localPath, blob.url);
          
          migrations.push({
            originalUrl: blob.url,
            cloudinaryUrl: cloudinaryResult.secure_url,
            cloudinaryData: cloudinaryResult,
            pathname: blob.pathname,
          });
        } else {
          console.log(`   🔍 Would upload to Cloudinary: ${blob.pathname}`);
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${blob.pathname}:`, error.message);
        console.error('   Continuing with next video...');
      }
    }
    
    if (migrations.length > 0) {
      console.log('\n\n📊 Step 2: Updating database records...\n');
      
      const sql = await getDbConnection();
      const changes = [];
      
      for (const migration of migrations) {
        const change = await updateMediaRecord(
          sql,
          migration.originalUrl,
          migration.cloudinaryUrl,
          migration.cloudinaryData
        );
        
        if (change) {
          changes.push(change);
        }
      }
      
      await sql.end();
      
      if (changes.length > 0 && !DRY_RUN) {
        createRollbackScript(changes);
      }
      
      console.log('\n\n✅ MIGRATION COMPLETE!\n');
      console.log('📊 Summary:');
      console.log(`   Videos found: ${videoBlobs.length}`);
      console.log(`   Videos backed up: ${videoBlobs.length}`);
      console.log(`   Videos uploaded to Cloudinary: ${migrations.length}`);
      console.log(`   Database records updated: ${changes.length}`);
      console.log(`\n📁 Backups saved to: ${BACKUP_DIR}`);
      
    } else if (DRY_RUN) {
      console.log('\n\n🔍 DRY RUN COMPLETE - No changes made');
      console.log(`\n   Would migrate ${videoBlobs.length} videos`);
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrate();

