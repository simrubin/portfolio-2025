#!/usr/bin/env node

/**
 * Fix video filenames in database to restore original names
 * while keeping Cloudinary URLs
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../apps/portfolio-cms/.env.local') });

const POSTGRES_URL = process.env.POSTGRES_URL;
const DRY_RUN = process.argv.includes('--dry-run');

console.log('🔧 Fixing video filenames...\n');

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made\n');
}

async function fix() {
  const { default: postgres } = await import('postgres');
  const sql = postgres(POSTGRES_URL);
  
  // Get all videos
  const videos = await sql`
    SELECT id, url, filename, mime_type 
    FROM media 
    WHERE mime_type LIKE 'video/%'
    ORDER BY id
  `;
  
  console.log(`Found ${videos.length} videos to check:\n`);
  
  const fixes = [];
  
  for (const video of videos) {
    console.log(`Video ID ${video.id}:`);
    console.log(`  Current filename: ${video.filename}`);
    console.log(`  Current URL: ${video.url}`);
    
    // If filename contains the double path, extract the original name
    if (video.filename && video.filename.includes('portfolio-videos/portfolio-videos/')) {
      // Extract the base name from the end of the path
      const baseName = video.filename.replace('portfolio-videos/portfolio-videos/', '');
      
      // Determine extension from URL
      let extension = '';
      if (video.url) {
        const urlExt = path.extname(video.url);
        extension = urlExt || '.mp4'; // Default to .mp4 if not found
      }
      
      const newFilename = baseName.includes('.') ? baseName : `${baseName}${extension}`;
      
      console.log(`  → New filename: ${newFilename}`);
      
      if (DRY_RUN) {
        console.log(`  🔍 Would update to: ${newFilename}\n`);
      } else {
        await sql`
          UPDATE media 
          SET filename = ${newFilename}
          WHERE id = ${video.id}
        `;
        console.log(`  ✅ Updated!\n`);
      }
      
      fixes.push({
        id: video.id,
        old: video.filename,
        new: newFilename,
      });
    } else {
      console.log(`  ✓ Filename looks good (no change needed)\n`);
    }
  }
  
  await sql.end();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Total videos checked: ${videos.length}`);
  console.log(`   Filenames fixed: ${fixes.length}`);
  
  if (fixes.length > 0) {
    console.log('\n✅ Fixed filenames:');
    fixes.forEach(fix => {
      console.log(`   ID ${fix.id}: "${fix.old}" → "${fix.new}"`);
    });
  }
  
  if (DRY_RUN) {
    console.log('\n🔍 Dry run complete. Run without --dry-run to apply changes.');
  } else {
    console.log('\n✅ All fixes applied!');
  }
}

fix().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

