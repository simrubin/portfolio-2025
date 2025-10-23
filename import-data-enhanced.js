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

// Chunked upload for large files
async function uploadMediaChunked(
  cmsUrl,
  token,
  filePath,
  alt,
  maxChunkSize = 3 * 1024 * 1024
) {
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  const filename = path.basename(filePath);

  // If file is small enough, use regular upload
  if (fileSize <= maxChunkSize) {
    return await uploadMediaRegular(cmsUrl, token, filePath, alt);
  }

  console.log(
    `   📦 Chunking large file: ${filename} (${(fileSize / 1024 / 1024).toFixed(2)}MB)`
  );

  // For large files, we'll need to implement a chunked upload strategy
  // Since Payload doesn't have built-in chunked upload, we'll split the file
  // and upload in smaller pieces, then reassemble on the server

  // For now, let's skip files that are too large and log them
  console.log(`   ⚠️  Skipping large file: ${filename} - exceeds chunk limit`);
  return null;
}

async function uploadMediaRegular(cmsUrl, token, filePath, alt) {
  const formData = new FormData();

  // Read file as buffer and create a Blob
  const fileBuffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  const blob = new Blob([fileBuffer]);

  formData.append("file", blob, filename);
  if (alt) formData.append("alt", alt);

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
  console.log("🚀 Enhanced Payload CMS Data Import Tool\n");

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
    const mediaDataPath = path.join(
      process.cwd(),
      "data-backup",
      "media-export.json"
    );
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
    console.log("⚠️  Note: Files >3MB will be skipped (Vercel limit)\n");

    const idMap = {}; // Maps old IDs to new UUIDs
    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;
    const failedFiles = [];
    const skippedFiles = [];

    for (let i = 0; i < mediaList.length; i++) {
      const media = mediaList[i];
      const mediaFilePath = path.join(mediaFilesDir, media.filename);

      if (!fs.existsSync(mediaFilePath)) {
        console.log(
          `   ⚠️  [${i + 1}/${mediaList.length}] Skipping ${media.filename} - file not found`
        );
        failCount++;
        failedFiles.push({
          filename: media.filename,
          reason: "File not found",
        });
        continue;
      }

      // Check file size
      const stats = fs.statSync(mediaFilePath);
      const fileSizeMB = stats.size / (1024 * 1024);

      if (fileSizeMB > 3) {
        console.log(
          `   ⏭️  [${i + 1}/${mediaList.length}] Skipping ${media.filename} - too large (${fileSizeMB.toFixed(2)}MB)`
        );
        skipCount++;
        skippedFiles.push({
          filename: media.filename,
          size: fileSizeMB.toFixed(2) + "MB",
        });
        continue;
      }

      try {
        const result = await uploadMediaChunked(
          cmsUrl.trim(),
          token,
          mediaFilePath,
          media.alt
        );

        if (result && result.doc) {
          idMap[media.id] = result.doc.id; // Map old ID to new UUID
          successCount++;
          console.log(
            `   ✅ [${i + 1}/${mediaList.length}] Uploaded: ${media.filename} (${fileSizeMB.toFixed(2)}MB)`
          );
        } else {
          failCount++;
          failedFiles.push({
            filename: media.filename,
            reason: "Upload returned null",
          });
        }

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
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
    console.log(`   ⏭️  Skipped (too large): ${skipCount}`);
    console.log(`   🗺️  ID mappings created: ${Object.keys(idMap).length}\n`);

    if (skippedFiles.length > 0) {
      console.log(
        `⏭️  Skipped files (>3MB - upload manually via admin panel):`
      );
      skippedFiles.slice(0, 10).forEach((f) => {
        console.log(`   - ${f.filename}: ${f.size}`);
      });
      if (skippedFiles.length > 10) {
        console.log(`   ... and ${skippedFiles.length - 10} more\n`);
      }
    }

    if (failedFiles.length > 0) {
      console.log(`❌ Failed files:`);
      failedFiles.slice(0, 10).forEach((f) => {
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

    if (continueImport.trim().toLowerCase() !== "yes") {
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

        // Log missing media references
        const missingHero = project.heroImage && !idMap[project.heroImage];
        const missingSectionMedia = project.sections?.some((section) =>
          section.media?.some((m) => m.mediaItem && !idMap[m.mediaItem])
        );

        if (missingHero || missingSectionMedia) {
          console.log(
            `   ⚠️  [${i + 1}/${projectsList.length}] ${project.title}: Some media references missing (likely skipped large files)`
          );
        }

        const result = await createProject(cmsUrl.trim(), token, mappedProject);
        projectSuccessCount++;
        console.log(
          `   ✅ [${i + 1}/${projectsList.length}] Imported: ${project.title}`
        );

        // Add a small delay
        await new Promise((resolve) => setTimeout(resolve, 200));
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
    console.log(
      "\n🎉 Check your CMS admin panel at " + cmsUrl.trim() + "/admin"
    );

    if (skippedFiles.length > 0) {
      console.log("\n💡 Next steps for large files:");
      console.log("   1. Go to your admin panel → Media");
      console.log("   2. Upload the skipped files manually");
      console.log("   3. Edit your projects to add the missing media");
      console.log(`\n📁 Large files to upload manually:`);
      skippedFiles.forEach((f) => {
        console.log(`   - ${f.filename} (${f.size})`);
      });
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    rl.close();
  }
}

importData();
