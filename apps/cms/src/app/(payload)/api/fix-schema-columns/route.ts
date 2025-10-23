import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Get the database connection
    const db = payload.db
    
    // Check if the test_projects_id column exists and remove it
    try {
      await db.drizzle.execute(`
        ALTER TABLE payload_locked_documents_rels 
        DROP COLUMN IF EXISTS test_projects_id
      `)
      
      console.log('✅ Removed test_projects_id column from payload_locked_documents_rels')
    } catch (error) {
      console.log('ℹ️ test_projects_id column not found or already removed:', error.message)
    }
    
    // Check for any other test_projects references
    try {
      const result = await db.drizzle.execute(`
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE column_name LIKE '%test_projects%'
      `)
      
      if (result.rows && result.rows.length > 0) {
        console.log('Found test_projects references:', result.rows)
        
        // Remove any other test_projects references
        for (const row of result.rows) {
          try {
            await db.drizzle.execute(`
              ALTER TABLE ${row.table_name} 
              DROP COLUMN IF EXISTS ${row.column_name}
            `)
            console.log(`✅ Removed ${row.column_name} from ${row.table_name}`)
          } catch (error) {
            console.log(`ℹ️ Could not remove ${row.column_name} from ${row.table_name}:`, error.message)
          }
        }
      } else {
        console.log('✅ No test_projects references found')
      }
    } catch (error) {
      console.log('ℹ️ Could not check for test_projects references:', error.message)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database schema cleaned up successfully',
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
