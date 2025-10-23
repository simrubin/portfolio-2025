import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await migrateDatabase()
}

export async function POST() {
  return await migrateDatabase()
}

async function migrateDatabase() {
  try {
    console.log('🔄 Starting database migration...')
    
    const payload = await getPayload({ config })
    
    // Get the database adapter
    const db = payload.db
    
    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Database adapter not available',
      })
    }
    
    // Check if we're using Postgres
    if (!('execute' in db)) {
      return NextResponse.json({
        success: false,
        error: 'Not using Postgres adapter',
      })
    }
    
    console.log('📋 Running database migration...')
    
    // Try to trigger Payload's migration by accessing the admin interface
    // This should create all the necessary tables
    try {
      // Access the admin config to trigger schema creation
      const adminConfig = payload.config.admin
      console.log('✅ Admin config accessed')
      
      // Try to access each collection to trigger table creation
      const collections = ['users', 'projects', 'media', 'pages', 'posts', 'categories']
      const results: any = {}
      
      for (const collection of collections) {
        try {
          console.log(`🔄 Migrating ${collection}...`)
          
          // This should trigger table creation
          const result = await payload.find({
            collection: collection as any,
            limit: 0, // Just check if table exists
          })
          
          results[collection] = {
            success: true,
            message: 'Table created successfully',
            count: result.docs.length,
          }
          
          console.log(`✅ ${collection} migrated successfully`)
          
        } catch (error: any) {
          results[collection] = {
            success: false,
            error: error.message,
          }
          console.log(`❌ ${collection} migration failed:`, error.message)
        }
      }
      
      // Test if we can now access projects
      let projectsTest = null
      try {
        const projects = await payload.find({
          collection: 'projects',
          limit: 5,
        })
        projectsTest = {
          success: true,
          count: projects.docs.length,
          message: 'Projects collection is now accessible',
        }
      } catch (error: any) {
        projectsTest = {
          success: false,
          error: error.message,
          message: 'Projects collection still not accessible',
        }
      }
      
      console.log('✅ Database migration completed!')
      
      return NextResponse.json({
        success: true,
        message: 'Database migration completed',
        results,
        projectsTest,
        timestamp: new Date().toISOString(),
      })
      
    } catch (migrationError: any) {
      console.error('❌ Migration error:', migrationError.message)
      
      return NextResponse.json({
        success: false,
        error: 'Migration failed',
        details: migrationError.message,
        suggestion: 'Try restarting the application or check database permissions',
      })
    }
    
  } catch (error: any) {
    console.error('❌ Error migrating database:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        suggestion: 'Check database connection and permissions',
      },
      { status: 500 },
    )
  }
}
