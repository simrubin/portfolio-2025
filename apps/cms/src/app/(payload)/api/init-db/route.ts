import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔧 Initializing database schema...')

    // Get the config first
    const config = await configPromise

    // Initialize Payload with explicit database initialization
    const payload = await getPayload({ 
      config,
      // Force initialization
      disableOnInit: false,
    })

    console.log('✅ Payload initialized successfully')

    // Force database schema creation by accessing the database adapter directly
    if (payload.db && typeof payload.db.init === 'function') {
      console.log('🔧 Initializing database adapter...')
      await payload.db.init()
      console.log('✅ Database adapter initialized')
    }

    // Now try to check if users exist
    let usersExist = false
    try {
      const users = await payload.find({
        collection: 'users',
        limit: 1,
      })
      usersExist = users.docs.length > 0
      console.log(`✅ Users table ready, ${users.docs.length} users found`)
    } catch (userError) {
      console.log('⚠️ Users table not accessible yet, but schema should be created')
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema initialized successfully',
      usersExist,
      nextStep: usersExist 
        ? 'Go to /admin to log in' 
        : 'Go to /admin to create your first user',
    })
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
