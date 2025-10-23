const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function runMigration() {
  console.log("🚀 Direct Database Migration Tool\n");
  console.log(
    "This will copy all your data from local SQLite to production Postgres.\n"
  );

  try {
    // Get Postgres URL from user
    const postgresUrl = await question(
      "Enter your Vercel Postgres URL (from Vercel dashboard → Storage → Postgres → Connect): "
    );

    if (!postgresUrl.trim()) {
      console.log("❌ Postgres URL is required");
      process.exit(1);
    }

    console.log("\n🔧 Setting environment variable and running migration...\n");

    // Set environment variable and run migration
    process.env.POSTGRES_URL = postgresUrl.trim();

    // Import and run the migration
    const { migrateData } = await import("./direct-migration.js");
    await migrateData();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  } finally {
    rl.close();
  }
}

runMigration();
