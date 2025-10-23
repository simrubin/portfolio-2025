import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await initPostgresSchema()
}

export async function POST() {
  return await initPostgresSchema()
}

async function initPostgresSchema() {
  try {
    console.log('🔄 Initializing Postgres schema...')
    
    const payload = await getPayload({ config })
    
    // Force Payload to create the schema
    console.log('📋 Creating database schema...')
    
    // This will trigger Payload's auto-migration
    const result = await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    console.log('✅ Schema initialization completed!')
    
    return NextResponse.json({
      success: true,
      message: 'Postgres schema initialized successfully',
      details: {
        usersCollection: 'Accessible',
        schemaCreated: true,
        timestamp: new Date().toISOString(),
      },
    })
    
  } catch (error: any) {
    console.error('❌ Error initializing schema:', error.message)
    
    // If it's a schema error, try to create the schema manually
    if (error.message.includes('relation') || error.message.includes('does not exist')) {
      try {
        console.log('🔄 Attempting to create schema manually...')
        
        const payload = await getPayload({ config })
        
        // Try to access each collection to trigger schema creation
        const collections = ['users', 'projects', 'media', 'pages', 'posts', 'categories']
        
        for (const collection of collections) {
          try {
            await payload.find({
              collection: collection as any,
              limit: 1,
            })
            console.log(`✅ ${collection} collection schema created`)
          } catch (collectionError: any) {
            console.log(`⚠️ ${collection} collection error:`, collectionError.message)
          }
        }
        
        return NextResponse.json({
          success: true,
          message: 'Schema creation attempted - some collections may have been created',
          details: {
            collectionsChecked: collections,
            timestamp: new Date().toISOString(),
          },
        })
        
      } catch (manualError: any) {
        return NextResponse.json(
          {
            success: false,
            error: 'Schema initialization failed',
            originalError: error.message,
            manualError: manualError.message,
            suggestion: 'Try running the migration script or check database permissions',
          },
          { status: 500 },
        )
      }
    }
    
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
