#!/usr/bin/env node

/**
 * Debug what the CMS API is actually returning for media objects
 */

import fetch from 'node-fetch';

const CMS_URL = 'https://portfolio-cms-mocha-ten.vercel.app';

async function debug() {
  console.log('🔍 Debugging CMS API Response...\n');
  
  const response = await fetch(
    `${CMS_URL}/api/projects?where[_status][equals]=published&limit=1&depth=2`
  );
  
  const data = await response.json();
  const project = data.docs[0];
  
  if (!project) {
    console.log('No projects found');
    return;
  }
  
  console.log(`Project: ${project.title}\n`);
  
  // Find first video in sections
  if (project.sections) {
    for (const section of project.sections) {
      if (section.media && section.media.length > 0) {
        for (const mediaItem of section.media) {
          const media = mediaItem.mediaItem;
          if (media && typeof media === 'object' && media.mime_type?.startsWith('video/')) {
            console.log('🎬 Found video in API response:');
            console.log(JSON.stringify(media, null, 2));
            console.log('\n📊 Key fields:');
            console.log(`  id: ${media.id}`);
            console.log(`  filename: ${media.filename}`);
            console.log(`  url: ${media.url || 'MISSING!'}`);
            console.log(`  mime_type: ${media.mime_type}`);
            return;
          }
        }
      }
    }
  }
  
  console.log('No videos found in first project');
}

debug();

