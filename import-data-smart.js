const fs = require('fs');
const path = require('path');
const readline = require('readline');
const FormData = require('form-data');
const fetch = require('node-fetch');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function login(cmsUrl, email, password) {
  const response = await fetch(`${cmsUrl}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.token;
}

async function uploadMedia(cmsUrl, token, filePath, alt) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  if (alt) form.append('alt', alt);

  const response = await fetch(`${cmsUrl}/api/media`, {
    method: 'POST',
    headers: {
      'Authorization': `JWT ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload ${path.basename(filePath)}: ${error}`);
  }

  return await response.json();
}

async function createProject(cmsUrl, token, projectData) {
  const response = await fetch(`${cmsUrl}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create project: ${error}`);
  }

  return await response.json();
}

async function importData() {
  console.log('🚀 Smart Payload CMS Data Import Tool\n');

  try {
    const cmsUrl = await question('Enter your CMS URL (e.g., https://portfolio-cms-fawn-one.vercel.app): ');
    const email = await question('Enter your admin email: ');
    const password = await question('Enter your admin password: ');

    console.log('🔐 Logging in...');
    const token = await login(cmsUrl.trim(), email.trim(), password.trim());
    console.log('✅ Logged in successfully!\n');

    // Read exported data
    const mediaDataPath = path.join(process.cwd(), 'data-backup', 'media.json');
    const projectsDataPath = path.join(process.cwd(), 'data-backup', 'projects.json');
    const mediaFilesDir = path.join(process.cwd(), 'data-backup', 'media-files');

    if (!fs.existsSync(mediaDataPath) || !fs.existsSync(projectsDataPath)) {
      throw new Error('Export data not found. Please run export-data.js first.');
    }

    const mediaData = JSON.parse(fs.readFileSync(mediaDataPath, 'utf8'));
    const projectsData = JSON.parse(fs.readFileSync(projectsDataPath, 'utf8'));

    console.log(`Found ${mediaData.length} media files and ${projectsData.length} projects\n`);

    // Step 1: Upload media and create ID mapping
    console.log('📤 Step 1: Uploading media files...');
    const idMap = {}; // Maps old IDs to new UUIDs

    for (const media of mediaData) {
      const mediaFilePath = path.join(mediaFilesDir, media.filename);
      
      if (!fs.existsSync(mediaFilePath)) {
        console.log(`   ⚠️  Skipping ${media.filename} - file not found`);
        continue;
      }

      try {
        const result = await uploadMedia(cmsUrl.trim(), token, mediaFilePath, media.alt);
        idMap[media.id] = result.doc.id; // Map old ID to new UUID
        console.log(`   ✅ Uploaded: ${media.filename} (${media.id} → ${result.doc.id})`);
      } catch (error) {
        console.log(`   ❌ Failed to upload ${media.filename}: ${error.message}`);
      }
    }

    console.log(`\n✅ Media upload complete! Mapped ${Object.keys(idMap).length} IDs\n`);

    // Step 2: Import projects with mapped IDs
    console.log('📦 Step 2: Importing projects...');

    for (const project of projectsData) {
      try {
        // Map the hero image ID
        const mappedProject = {
          title: project.title,
          slug: project.slug,
          heroImage: idMap[project.heroImage] || null,
          publishedAt: project.publishedAt,
          year: project.year,
          newlyAdded: project.newlyAdded || false,
          sections: project.sections?.map(section => ({
            sectionTitle: section.sectionTitle,
            textBody: section.textBody,
            media: section.media?.map(m => ({
              mediaItem: idMap[m.mediaItem] || null,
              caption: m.caption || '',
            })).filter(m => m.mediaItem !== null) || [],
          })) || [],
          _status: 'published',
        };

        // Remove null hero image if it doesn't exist
        if (!mappedProject.heroImage) {
          console.log(`   ⚠️  ${project.title}: Hero image not found, skipping...`);
          continue;
        }

        await createProject(cmsUrl.trim(), token, mappedProject);
        console.log(`   ✅ Imported: ${project.title}`);
      } catch (error) {
        console.log(`   ❌ Failed: ${project.title} - ${error.message}`);
      }
    }

    console.log('\n✅ Import complete!');
    console.log('\n🎉 All done! Check your CMS admin panel.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

importData();
