import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Test if we can access projects collection
    const projects = await payload.find({
      collection: 'projects',
      limit: 5,
    })

    // Test if we can access users collection
    const users = await payload.find({
      collection: 'users',
      limit: 5,
    })

    return NextResponse.json({
      success: true,
      projects: {
        totalDocs: projects.totalDocs,
        docs: projects.docs.map((p) => ({ id: p.id, title: p.title, _status: p._status })),
      },
      users: {
        totalDocs: users.totalDocs,
        docs: users.docs.map((u) => ({ id: u.id, email: u.email })),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

