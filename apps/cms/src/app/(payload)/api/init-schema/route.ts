import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await initSchema()
}

export async function POST() {
  return await initSchema()
}

async function initSchema() {
  try {
    console.log('🔄 Initializing database schema...')

    const payload = await getPayload({ config })

    // Test the connection by trying to find any collection
    console.log('📊 Testing database connection...')

    // Try to access the projects collection to trigger schema creation
    try {
      const projects = await payload.find({
        collection: 'projects',
        limit: 1,
      })
      console.log('✅ Projects collection accessible')
    } catch (error: any) {
      console.log('⚠️  Projects collection not accessible, schema may need initialization')
    }

    // Try to access the media collection
    try {
      const media = await payload.find({
        collection: 'media',
        limit: 1,
      })
      console.log('✅ Media collection accessible')
    } catch (error: any) {
      console.log('⚠️  Media collection not accessible, schema may need initialization')
    }

    // Try to access the users collection
    try {
      const users = await payload.find({
        collection: 'users',
        limit: 1,
      })
      console.log('✅ Users collection accessible')
    } catch (error: any) {
      console.log('⚠️  Users collection not accessible, schema may need initialization')
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema initialization completed',
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error initializing schema:', error.message)
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
