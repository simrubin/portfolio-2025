import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Get the user
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    if (users.docs.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No users found'
      })
    }
    
    const user = users.docs[0]
    
    // Check if user has proper permissions
    const userPermissions = {
      id: user.id,
      email: user.email,
      name: user.name,
      hasSessions: user.sessions && user.sessions.length > 0,
      sessionCount: user.sessions ? user.sessions.length : 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
    
    // Test if we can access projects as this user
    const projects = await payload.find({
      collection: 'projects',
      limit: 3,
    })
    
    return NextResponse.json({
      success: true,
      message: 'User authentication is working',
      user: userPermissions,
      projects: {
        totalDocs: projects.totalDocs,
        sample: projects.docs.map(p => ({ id: p.id, title: p.title, _status: p._status }))
      },
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
