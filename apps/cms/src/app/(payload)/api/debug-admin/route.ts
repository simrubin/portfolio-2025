import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Test all the things the admin panel needs
    const results = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasPayloadSecret: !!process.env.PAYLOAD_SECRET,
        serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      },
      database: {
        projects: await payload.find({
          collection: 'projects',
          limit: 3,
        }),
        media: await payload.find({
          collection: 'media',
          limit: 3,
        }),
        users: await payload.find({
          collection: 'users',
          limit: 1,
        }),
      },
      collections: {
        projectsConfig: {
          slug: 'projects',
          access: config.collections?.find(c => c.slug === 'projects')?.access,
        },
        mediaConfig: {
          slug: 'media',
          access: config.collections?.find(c => c.slug === 'media')?.access,
        },
      }
    }
    
    return NextResponse.json({
      success: true,
      ...results
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
