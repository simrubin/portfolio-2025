import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Test if we can access projects collection (this should work without auth)
    const projects = await payload.find({
      collection: 'projects',
      limit: 3,
    })
    
    // Test if we can access users collection (this requires auth)
    let users = null
    try {
      users = await payload.find({
        collection: 'users',
        limit: 1,
      })
    } catch (error) {
      users = { error: 'Authentication required' }
    }
    
    return NextResponse.json({
      success: true,
      message: 'CMS is working correctly',
      projects: {
        totalDocs: projects.totalDocs,
        sample: projects.docs.map(p => ({ id: p.id, title: p.title, _status: p._status }))
      },
      users: users,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
