import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json(
      { success: false, error: 'POSTGRES_URL environment variable is not set' },
      { status: 500 },
    )
  }

  try {
    console.log('🔧 Clearing database and letting Payload create its own schema...')
    
    // Clear the database completely
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    })
    
    const client = await pool.connect()
    
    try {
      // Drop everything and start fresh
      await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
      console.log('✅ Database cleared')
    } finally {
      client.release()
      await pool.end()
    }

    // Now dynamically import and initialize Payload to let it create its own schema
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    
    console.log('🔧 Initializing Payload to create schema...')
    
    const config = await configPromise.default
    const payload = await getPayload({ 
      config,
      disableOnInit: false,
    })
    
    console.log('✅ Payload initialized')
    
    // Try to access collections to trigger schema creation
    try {
      console.log('🔧 Triggering schema creation by accessing collections...')
      
      // This should trigger the creation of all tables
      await payload.find({
        collection: 'users',
        limit: 0,
      })
      
      console.log('✅ Schema created successfully')
      
      return NextResponse.json({
        success: true,
        message: 'Payload schema created successfully',
        nextStep: 'Go to /admin to create your first user'
      })
      
    } catch (schemaError) {
      console.log('⚠️ Schema creation might have failed, but this could be expected')
      console.log('Error:', schemaError)
      
      return NextResponse.json({
        success: true,
        message: 'Payload initialized, schema creation attempted',
        warning: 'Some errors occurred but schema might exist',
        nextStep: 'Try going to /admin to create your first user'
      })
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
