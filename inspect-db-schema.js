#!/usr/bin/env node

const sqlite3 = require("sqlite3").verbose();

// Database path
const dbPath = "./apps/cms/cms.db";

console.log("🔍 Inspecting database schema...");

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to SQLite database");
});

// Get table schema
function inspectTable(tableName) {
  return new Promise((resolve, reject) => {
    console.log(`\n📋 Table: ${tableName}`);
    console.log("─".repeat(50));

    const query = `PRAGMA table_info(${tableName})`;
    db.all(query, [], (err, rows) => {
      if (err) {
        console.log(`❌ Error inspecting ${tableName}:`, err.message);
        resolve([]);
        return;
      }

      if (rows.length === 0) {
        console.log("   (table not found)");
        resolve([]);
        return;
      }

      rows.forEach((row) => {
        console.log(
          `   ${row.name} (${row.type}) ${row.notnull ? "NOT NULL" : ""} ${row.pk ? "PRIMARY KEY" : ""}`
        );
      });

      resolve(rows);
    });
  });
}

// Get all tables
function getAllTables() {
  return new Promise((resolve, reject) => {
    const query = "SELECT name FROM sqlite_master WHERE type='table'";
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows.map((row) => row.name));
    });
  });
}

// Get sample data from projects table
function getSampleProjects() {
  return new Promise((resolve, reject) => {
    console.log("\n📊 Sample projects data:");
    console.log("─".repeat(50));

    const query = `SELECT * FROM projects LIMIT 3`;
    db.all(query, [], (err, rows) => {
      if (err) {
        console.log("❌ Error getting sample data:", err.message);
        resolve([]);
        return;
      }

      rows.forEach((row, index) => {
        console.log(`\nProject ${index + 1}:`);
        Object.keys(row).forEach((key) => {
          const value = row[key];
          if (typeof value === "string" && value.length > 100) {
            console.log(`   ${key}: ${value.substring(0, 100)}...`);
          } else {
            console.log(`   ${key}: ${value}`);
          }
        });
      });

      resolve(rows);
    });
  });
}

// Main inspection
async function runInspection() {
  try {
    // Get all tables
    const tables = await getAllTables();
    console.log(`\n📋 Found ${tables.length} tables:`, tables.join(", "));

    // Inspect each table
    for (const table of tables) {
      await inspectTable(table);
    }

    // Get sample projects data
    await getSampleProjects();

    console.log("\n✅ Database inspection completed!");
  } catch (error) {
    console.error("❌ Inspection failed:", error.message);
  } finally {
    db.close((err) => {
      if (err) {
        console.error("❌ Error closing database:", err.message);
      } else {
        console.log("🔒 Database connection closed");
      }
    });
  }
}

// Run the inspection
runInspection();
