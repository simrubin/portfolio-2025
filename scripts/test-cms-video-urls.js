#!/usr/bin/env node

/**
 * Test that CMS API is returning Cloudinary URLs for videos
 */

import fetch from 'node-fetch';

const CMS_URL = 'https://portfolio-cms-mocha-ten.vercel.app';

async function test() {
  console.log('🧪 Testing CMS API for video URLs...\n');
  console.log(`Fetching from: ${CMS_URL}/api/projects\n`);
  
  try {
    const response = await fetch(
      `${CMS_URL}/api/projects?where[_status][equals]=published&limit=3&depth=2`
    );
    
    if (!response.ok) {
      console.error('❌ Failed to fetch projects:', response.statusText);
      return;
    }
    
    const data = await response.json();
    
    console.log(`✅ Found ${data.docs.length} projects\n`);
    
    // Look for videos in the projects
    let videoCount = 0;
    let cloudinaryCount = 0;
    
    data.docs.forEach(project => {
      if (project.sections) {
        project.sections.forEach(section => {
          if (section.media) {
            section.media.forEach(mediaItem => {
              const media = mediaItem.mediaItem;
              if (media && typeof media === 'object') {
                if (media.mime_type?.startsWith('video/')) {
                  videoCount++;
                  console.log(`📹 Video found: ${media.filename || media.id}`);
                  console.log(`   URL: ${media.url || 'NO URL FIELD'}`);
                  
                  if (media.url && media.url.includes('cloudinary.com')) {
                    console.log(`   ✅ Using Cloudinary!\n`);
                    cloudinaryCount++;
                  } else if (media.url && media.url.startsWith('http')) {
                    console.log(`   ⚠️  External URL but not Cloudinary\n`);
                  } else {
                    console.log(`   ❌ Not using Cloudinary (URL: ${media.url || 'missing'})\n`);
                  }
                }
              }
            });
          }
        });
      }
    });
    
    console.log('=' .repeat(60));
    console.log('📊 Summary:');
    console.log(`   Total videos found: ${videoCount}`);
    console.log(`   Videos on Cloudinary: ${cloudinaryCount}`);
    console.log(`   Videos NOT on Cloudinary: ${videoCount - cloudinaryCount}`);
    
    if (cloudinaryCount === videoCount && videoCount > 0) {
      console.log('\n✅ SUCCESS! All videos are using Cloudinary URLs!');
    } else if (cloudinaryCount > 0) {
      console.log('\n⚠️  PARTIAL: Some videos are on Cloudinary, some are not.');
    } else {
      console.log('\n❌ FAILED: No videos are using Cloudinary URLs yet.');
      console.log('   Wait a few more minutes for deployment to complete.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();

