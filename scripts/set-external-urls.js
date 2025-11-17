#!/usr/bin/env node

/**
 * Copy Cloudinary URLs to the new externalUrl field
 * This ensures videos bypass Vercel Blob and use Cloudinary
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../apps/portfolio-cms/.env.local') });

const POSTGRES_URL = process.env.POSTGRES_URL;

async function fix() {
  const { default: postgres } = await import('postgres');
  const sql = postgres(POSTGRES_URL);
  
  console.log('🔧 Setting externalUrl for Cloudinary videos...\n');
  
  // Find all videos with Cloudinary URLs
  const videos = await sql`
    SELECT id, url, filename 
    FROM media 
    WHERE url LIKE '%cloudinary.com%'
  `;
  
  console.log(`Found ${videos.length} videos on Cloudinary\n`);
  
  for (const video of videos) {
    console.log(`Video ID ${video.id}: ${video.filename}`);
    console.log(`  Setting externalUrl: ${video.url}`);
    
    await sql`
      UPDATE media 
      SET "externalUrl" = ${video.url}
      WHERE id = ${video.id}
    `;
    
    console.log(`  ✅ Updated!\n`);
  }
  
  await sql.end();
  
  console.log('✅ All videos updated with externalUrl field!');
  console.log('\nNext: Deploy CMS and update frontend to use externalUrl');
}

fix().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

