const fs = require("fs");
const path = require("path");
const readline = require("readline");

let fetch;
let FormData;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function login(cmsUrl, email, password) {
  const response = await fetch(`${cmsUrl}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${errorText}`);
  }

  const data = await response.json();
  return data.token;
}

async function uploadMedia(cmsUrl, token, filePath, alt) {
  const formData = new FormData();
  
  // Read file as buffer and create a Blob
  const fileBuffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  const blob = new Blob([fileBuffer]);
  
  formData.append('file', blob, filename);
  if (alt) formData.append('alt', alt);

  const response = await fetch(`${cmsUrl}/api/media`, {
    method: "POST",
    headers: {
      Authorization: `JWT ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload ${filename}: ${errorText}`);
  }

  return await response.json();
}

async function createProject(cmsUrl, token, projectData) {
  const response = await fetch(`${cmsUrl}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create project: ${errorText}`);
  }

  return await response.json();
}

async function importData() {
  console.log("🚀 Smart Payload CMS Data Import Tool\n");

  try {
    // Dynamically import fetch and FormData
    const nodeFetch = await import("node-fetch");
    fetch = nodeFetch.default;
    FormData = nodeFetch.FormData;

    const cmsUrl = await question(
      "Enter your CMS URL (e.g., https://portfolio-cms-fawn-one.vercel.app): "
    );
    const email = await question("Enter your admin email: ");
    const password = await question("Enter your admin password: ");

    console.log("🔐 Logging in...");
    const token = await login(cmsUrl.trim(), email.trim(), password.trim());
    console.log("✅ Logged in successfully!\n");

    // Read exported data
    const mediaDataPath = path.join(process.cwd(), "data-backup", "media-export.json");
    const projectsDataPath = path.join(
      process.cwd(),
      "data-backup",
      "projects-export.json"
    );
    const mediaFilesDir = path.join(
      process.cwd(),
      "data-backup",
      "media-files"
    );

    if (!fs.existsSync(mediaDataPath) || !fs.existsSync(projectsDataPath)) {
      throw new Error(
        "Export data not found. Please run export-data.js first."
      );
    }

    const mediaData = JSON.parse(fs.readFileSync(mediaDataPath, "utf8"));
    const projectsData = JSON.parse(fs.readFileSync(projectsDataPath, "utf8"));

    // Extract docs array if it exists
    const mediaList = mediaData.docs || mediaData;
    const projectsList = projectsData.docs || projectsData;

    console.log(
      `Found ${mediaList.length} media files and ${projectsList.length} projects\n`
    );

    // Step 1: Upload media and create ID mapping
    console.log("📤 Step 1: Uploading media files...");
    console.log("⚠️  Note: Large files (>4MB) may fail due to Vercel limits\n");
    
    const idMap = {}; // Maps old IDs to new UUIDs
    let successCount = 0;
    let failCount = 0;
    const failedFiles = [];

    for (let i = 0; i < mediaList.length; i++) {
      const media = mediaList[i];
      const mediaFilePath = path.join(mediaFilesDir, media.filename);

      if (!fs.existsSync(mediaFilePath)) {
        console.log(`   ⚠️  [${i + 1}/${mediaList.length}] Skipping ${media.filename} - file not found`);
        failCount++;
        failedFiles.push({ filename: media.filename, reason: 'File not found' });
        continue;
      }

      // Check file size (skip files larger than 4MB to avoid Vercel limit)
      const stats = fs.statSync(mediaFilePath);
      const fileSizeMB = stats.size / (1024 * 1024);
      
      if (fileSizeMB > 4) {
        console.log(`   ⚠️  [${i + 1}/${mediaList.length}] Skipping ${media.filename} - file too large (${fileSizeMB.toFixed(2)}MB)`);
        failCount++;
        failedFiles.push({ filename: media.filename, reason: `Too large (${fileSizeMB.toFixed(2)}MB)` });
        continue;
      }

      try {
        const result = await uploadMedia(
          cmsUrl.trim(),
          token,
          mediaFilePath,
          media.alt
        );
        idMap[media.id] = result.doc.id; // Map old ID to new UUID
        successCount++;
        console.log(
          `   ✅ [${i + 1}/${mediaList.length}] Uploaded: ${media.filename} (${fileSizeMB.toFixed(2)}MB)`
        );
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        failCount++;
        failedFiles.push({ filename: media.filename, reason: error.message });
        console.log(
          `   ❌ [${i + 1}/${mediaList.length}] Failed to upload ${media.filename}: ${error.message}`
        );
      }
    }

    console.log(`\n📊 Media upload summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   🗺️  ID mappings created: ${Object.keys(idMap).length}\n`);

    if (failedFiles.length > 0) {
      console.log(`⚠️  Failed files (you can upload these manually via the admin panel):`);
      failedFiles.slice(0, 10).forEach(f => {
        console.log(`   - ${f.filename}: ${f.reason}`);
      });
      if (failedFiles.length > 10) {
        console.log(`   ... and ${failedFiles.length - 10} more\n`);
      }
    }

    // Ask if user wants to continue with project import
    const continueImport = await question(
      "\nDo you want to continue importing projects? (yes/no): "
    );
    
    if (continueImport.trim().toLowerCase() !== 'yes') {
      console.log("\n⏹️  Import cancelled by user.");
      return;
    }

    // Step 2: Import projects with mapped IDs
    console.log("\n📦 Step 2: Importing projects...");

    let projectSuccessCount = 0;
    let projectFailCount = 0;

    for (let i = 0; i < projectsList.length; i++) {
      const project = projectsList[i];
      
      try {
        // Map the hero image ID
        const mappedProject = {
          title: project.title,
          slug: project.slug,
          heroImage: idMap[project.heroImage] || null,
          publishedAt: project.publishedAt,
          year: project.year,
          newlyAdded: project.newlyAdded || false,
          sections:
            project.sections?.map((section) => ({
              sectionTitle: section.sectionTitle,
              textBody: section.textBody,
              media:
                section.media
                  ?.map((m) => ({
                    mediaItem: idMap[m.mediaItem] || null,
                    caption: m.caption || "",
                  }))
                  .filter((m) => m.mediaItem !== null) || [],
            })) || [],
          _status: "published",
        };

        // Remove null hero image if it doesn't exist
        if (!mappedProject.heroImage) {
          console.log(
            `   ⚠️  [${i + 1}/${projectsList.length}] ${project.title}: Hero image not found, setting to null`
          );
        }

        const result = await createProject(cmsUrl.trim(), token, mappedProject);
        projectSuccessCount++;
        console.log(`   ✅ [${i + 1}/${projectsList.length}] Imported: ${project.title}`);
        
        // Add a small delay
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        projectFailCount++;
        console.log(
          `   ❌ [${i + 1}/${projectsList.length}] Failed to import ${project.title}: ${error.message}`
        );
      }
    }

    console.log(`\n📊 Project import summary:`);
    console.log(`   ✅ Successful: ${projectSuccessCount}`);
    console.log(`   ❌ Failed: ${projectFailCount}\n`);

    console.log("\n✅ Import complete!");
    console.log("\n🎉 Check your CMS admin panel at " + cmsUrl.trim() + "/admin");
    
    if (failedFiles.length > 0) {
      console.log("\n💡 Tip: For failed media files, you can:");
      console.log("   1. Upload them manually via the admin panel");
      console.log("   2. Or re-run this script (it will skip already uploaded files)");
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    rl.close();
  }
}

importData();
