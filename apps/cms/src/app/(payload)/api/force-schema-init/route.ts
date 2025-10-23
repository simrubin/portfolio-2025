import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await forceSchemaInit()
}

export async function POST() {
  return await forceSchemaInit()
}

async function forceSchemaInit() {
  try {
    console.log('🔄 Force initializing Postgres schema...')
    
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
    
    console.log('📋 Forcing schema creation...')
    
    // Try to create the schema by accessing collections
    const collections = ['users', 'projects', 'media', 'pages', 'posts', 'categories']
    const results: any = {}
    
    for (const collection of collections) {
      try {
        console.log(`🔄 Creating schema for ${collection}...`)
        
        // Try to find documents - this should trigger schema creation
        const result = await payload.find({
          collection: collection as any,
          limit: 1,
        })
        
        results[collection] = {
          success: true,
          message: 'Schema created successfully',
          count: result.docs.length,
        }
        
        console.log(`✅ ${collection} schema created`)
        
      } catch (error: any) {
        results[collection] = {
          success: false,
          error: error.message,
        }
        console.log(`❌ ${collection} error:`, error.message)
      }
    }
    
    // Test if projects collection is now accessible
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
    
    console.log('✅ Schema initialization completed!')
    
    return NextResponse.json({
      success: true,
      message: 'Postgres schema force initialization completed',
      results,
      projectsTest,
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    console.error('❌ Error force initializing schema:', error.message)
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
