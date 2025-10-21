import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔧 Initializing database schema...')
    
    // Simply initializing Payload will create the schema
    const payload = await getPayload({ config: configPromise })
    
    console.log('✅ Database schema initialized successfully')
    
    // Check if any users exist
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      usersExist: users.docs.length > 0,
      nextStep: users.docs.length === 0 
        ? 'Create your first user at /admin' 
        : 'Database is ready, go to /admin to log in',
    })
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

