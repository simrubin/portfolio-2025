/**
 * Import Projects and Media to Deployed Payload CMS
 * Run this after deployment: node import-data.js
 *
 * You'll need to set your CMS URL and provide authentication
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function login(cmsUrl, email, password) {
  console.log("🔐 Logging in...");
  const response = await fetch(`${cmsUrl}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed. Check your credentials.");
  }

  const data = await response.json();
  return data.token;
}

async function importProjects(cmsUrl, token, projects, mediaMap) {
  console.log(`\n📦 Importing ${projects.length} projects...`);

  let successCount = 0;
  let errorCount = 0;

  for (const project of projects) {
    try {
      // Prepare project data - remove ID and system fields
      const projectData = {
        title: project.title,
        year: project.year,
        newlyAdded: project.newlyAdded,
        heroImage: project.heroImage,
        sections: project.sections,
        _status: project._status || "published",
      };

      // If heroImage is an object with ID, map it to new media ID
      if (projectData.heroImage && typeof projectData.heroImage === "object") {
        const oldMediaId = projectData.heroImage.id;
        if (mediaMap[oldMediaId]) {
          projectData.heroImage = mediaMap[oldMediaId];
        }
      }

      // Map media IDs in sections
      if (projectData.sections) {
        projectData.sections = projectData.sections.map((section) => {
          if (section.images) {
            section.images = section.images.map((img) => {
              if (img.image && typeof img.image === "object" && img.image.id) {
                const oldMediaId = img.image.id;
                if (mediaMap[oldMediaId]) {
                  return { ...img, image: mediaMap[oldMediaId] };
                }
              }
              return img;
            });
          }
          return section;
        });
      }

      const response = await fetch(`${cmsUrl}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        console.log(`   ✅ Imported: ${project.title}`);
        successCount++;
      } else {
        const error = await response.text();
        console.log(`   ❌ Failed: ${project.title} - ${error}`);
        errorCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.log(`   ❌ Error importing ${project.title}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   - Successful: ${successCount}`);
  console.log(`   - Failed: ${errorCount}`);
}

async function importData() {
  console.log("🚀 Payload CMS Data Import Tool\n");

  try {
    // Get CMS URL
    const cmsUrl = await question(
      "Enter your CMS URL (e.g., https://cms.simeonrubin.com): "
    );
    const email = await question("Enter your admin email: ");
    const password = await question("Enter your admin password: ");

    // Login
    const token = await login(cmsUrl.trim(), email.trim(), password.trim());
    console.log("✅ Logged in successfully!\n");

    // Read exported data
    const projectsFile = path.join(
      __dirname,
      "data-backup",
      "projects-export.json"
    );
    const mediaFile = path.join(__dirname, "data-backup", "media-export.json");

    if (!fs.existsSync(projectsFile)) {
      throw new Error(
        "Projects export file not found. Run export-data.js first!"
      );
    }

    const projectsData = JSON.parse(fs.readFileSync(projectsFile, "utf8"));
    const projects = projectsData.docs;

    console.log(`Found ${projects.length} projects to import`);

    // Note: Media files need to be uploaded manually via CMS or you need to implement file upload
    console.log(
      "\n⚠️  IMPORTANT: Media files must be uploaded to your CMS first!"
    );
    console.log("   You can either:");
    console.log("   1. Upload them manually via CMS admin panel");
    console.log("   2. Wait for this script to handle media (advanced)\n");

    const proceed = await question(
      "Do you want to proceed with project import? (yes/no): "
    );

    if (proceed.toLowerCase() !== "yes") {
      console.log("Import cancelled.");
      rl.close();
      return;
    }

    // For now, use empty media map - you'll need to manually relink images
    const mediaMap = {};

    // Import projects
    await importProjects(cmsUrl.trim(), token, projects, mediaMap);

    console.log("\n✨ Import complete!");
    console.log("\n📝 Next steps:");
    console.log("   1. Go to your CMS admin panel");
    console.log("   2. Check that all projects imported correctly");
    console.log("   3. Manually upload and relink images if needed");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }

  rl.close();
}

importData();
