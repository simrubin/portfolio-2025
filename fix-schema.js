const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

async function fixSchema() {
  try {
    console.log('🔧 Fixing database schema...');
    
    // Connect to the database
    const client = await pool.connect();
    
    try {
      // Check if the test_projects_id column exists
      const checkColumn = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'payload_locked_documents_rels' 
        AND column_name = 'test_projects_id'
      `);
      
      if (checkColumn.rows.length > 0) {
        console.log('❌ Found test_projects_id column, removing it...');
        
        // Drop the test_projects_id column
        await client.query(`
          ALTER TABLE payload_locked_documents_rels 
          DROP COLUMN IF EXISTS test_projects_id
        `);
        
        console.log('✅ Removed test_projects_id column');
      } else {
        console.log('✅ test_projects_id column not found, schema is clean');
      }
      
      // Check for any other test_projects references
      const checkOtherTables = await client.query(`
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE column_name LIKE '%test_projects%'
      `);
      
      if (checkOtherTables.rows.length > 0) {
        console.log('❌ Found other test_projects references:', checkOtherTables.rows);
        
        // Remove any other test_projects references
        for (const row of checkOtherTables.rows) {
          await client.query(`
            ALTER TABLE ${row.table_name} 
            DROP COLUMN IF EXISTS ${row.column_name}
          `);
          console.log(`✅ Removed ${row.column_name} from ${row.table_name}`);
        }
      } else {
        console.log('✅ No other test_projects references found');
      }
      
      console.log('🎉 Database schema fixed successfully!');
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixSchema();
