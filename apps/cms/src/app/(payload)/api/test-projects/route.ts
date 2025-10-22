import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: await configPromise })
    
    // Try to query projects
    const projects = await payload.find({
      collection: 'projects',
      limit: 10,
    })
    
    return NextResponse.json({
      success: true,
      message: 'Projects collection is accessible',
      count: projects.totalDocs,
      projects: projects.docs,
    })
  } catch (error) {
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
