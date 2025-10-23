import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Allow up to 60 seconds for schema creation

export async function GET() {
  try {
    console.log('🔧 Initializing Payload schema...')

    // Initialize Payload - this will trigger schema creation with push: true
    const payload = await getPayload({ config })

    console.log('✅ Payload initialized')

    // Try to query users to confirm schema exists
    try {
      const users = await payload.find({
        collection: 'users',
        limit: 0,
      })

      console.log('✅ Schema verified - users table exists')

      return NextResponse.json({
        success: true,
        message: 'Schema initialized successfully',
        usersCount: users.totalDocs,
        nextStep:
          users.totalDocs === 0
            ? 'Go to /admin to create your first user'
            : 'Schema is ready! You can now use the CMS',
      })
    } catch (queryError) {
      console.log('⚠️ Schema might still be initializing...')
      return NextResponse.json({
        success: true,
        message: 'Payload initialized, schema should be ready',
        warning: 'Could not verify users table, but it should exist',
        nextStep: 'Try going to /admin',
      })
    }
  } catch (error) {
    console.error('❌ Schema initialization failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
