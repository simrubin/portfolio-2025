#!/usr/bin/env node

/**
 * Check what URLs are in the database for videos
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../apps/portfolio-cms/.env.local') });

const POSTGRES_URL = process.env.POSTGRES_URL;

async function check() {
  const { default: postgres } = await import('postgres');
  const sql = postgres(POSTGRES_URL);
  
  const videos = await sql`
    SELECT id, url, filename, mime_type 
    FROM media 
    WHERE mime_type LIKE 'video/%'
    ORDER BY id
  `;
  
  console.log('Current video URLs in database:\n');
  videos.forEach(v => {
    console.log(`ID: ${v.id}`);
    console.log(`Filename: ${v.filename}`);
    console.log(`URL: ${v.url}`);
    console.log(`Looks correct: ${v.url.includes('cloudinary.com') ? '✅' : '❌'}\n`);
  });
  
  await sql.end();
}

check();

