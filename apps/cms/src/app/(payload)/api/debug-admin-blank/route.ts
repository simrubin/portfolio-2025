import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await debugAdminBlank()
}

export async function POST() {
  return await debugAdminBlank()
}

async function debugAdminBlank() {
  try {
    console.log('🔄 Debugging admin blank page issue...')

    const payload = await getPayload({ config })

    // Check if the admin interface is properly configured
    const adminConfig = payload.config.admin
    const collections = payload.config.collections || []
    const projectsCollection = collections.find((c) => c.slug === 'projects')

    // Test if we can access the projects collection directly
    let projectsTest = null
    try {
      const projects = await payload.find({
        collection: 'projects',
        limit: 10,
        page: 1,
        sort: '-updatedAt',
      })

      projectsTest = {
        success: true,
        count: projects.docs.length,
        totalDocs: projects.totalDocs,
        docs: projects.docs.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          slug: doc.slug,
          publishedAt: doc.publishedAt,
          updatedAt: doc.updatedAt,
          _status: doc._status,
        })),
      }
    } catch (error: any) {
      projectsTest = {
        success: false,
        error: error.message,
        message: 'Failed to access projects collection',
      }
    }

    // Test the exact API call the admin interface should make
    let adminAPITest = null
    try {
      const adminAPI = await payload.find({
        collection: 'projects',
        limit: 10,
        page: 1,
        sort: '-updatedAt',
        where: {
          _status: {
            equals: 'published',
          },
        },
      })

      adminAPITest = {
        success: true,
        count: adminAPI.docs.length,
        totalDocs: adminAPI.totalDocs,
        message: 'Admin API call successful',
      }
    } catch (error: any) {
      adminAPITest = {
        success: false,
        error: error.message,
        message: 'Admin API call failed',
      }
    }

    // Check collection configuration
    const collectionConfig = {
      exists: !!projectsCollection,
      slug: projectsCollection?.slug,
      admin: projectsCollection?.admin,
      access: projectsCollection?.access,
      fields: projectsCollection?.fields?.length || 0,
      versions: projectsCollection?.versions,
    }

    // Check if there are any issues with the collection
    const issues = []

    if (!projectsCollection) {
      issues.push('Projects collection not found in configuration')
    }

    if (projectsCollection && !projectsCollection.admin) {
      issues.push('Projects collection has no admin configuration')
    }

    if (projectsCollection && !projectsCollection.access) {
      issues.push('Projects collection has no access control')
    }

    if (
      projectsCollection &&
      projectsCollection.access &&
      Object.keys(projectsCollection.access).length === 0
    ) {
      issues.push('Projects collection access control is empty')
    }

    if (
      projectsCollection &&
      (!projectsCollection.fields || projectsCollection.fields.length === 0)
    ) {
      issues.push('Projects collection has no fields')
    }

    // Check if the collection has the required fields for admin display
    const requiredFields = ['title', 'slug', 'publishedAt', 'updatedAt']
    const missingFields = requiredFields.filter(
      (field) => !projectsCollection?.fields?.some((f) => 'name' in f && f.name === field),
    )

    if (missingFields.length > 0) {
      issues.push(`Missing required fields: ${missingFields.join(', ')}`)
    }

    // Test if the collection can be accessed through the admin interface
    let adminInterfaceTest = null
    try {
      // This simulates what the admin interface should do
      const adminInterface = await payload.find({
        collection: 'projects',
        limit: 10,
        page: 1,
        sort: '-updatedAt',
      })

      adminInterfaceTest = {
        success: true,
        count: adminInterface.docs.length,
        totalDocs: adminInterface.totalDocs,
        message: 'Admin interface can access projects',
      }
    } catch (error: any) {
      adminInterfaceTest = {
        success: false,
        error: error.message,
        message: 'Admin interface cannot access projects',
      }
    }

    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
      VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ? 'Set' : 'Not set',
      POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
    }

    return NextResponse.json({
      success: true,
      message: 'Admin blank page debugging completed',
      adminConfig: {
        exists: !!adminConfig,
        user: adminConfig?.user,
        components: adminConfig?.components,
      },
      collectionConfig,
      projectsTest,
      adminAPITest,
      adminInterfaceTest,
      issues,
      envCheck,
      suggestions:
        issues.length > 0
          ? [
              'Fix collection configuration issues',
              'Ensure all required fields are present',
              'Verify access control is properly configured',
              'Check admin configuration',
            ]
          : [
              'Collection configuration looks correct',
              'Check browser console for JavaScript errors',
              'Verify admin interface is loading properly',
              'Check if there are any network errors',
              'Verify authentication is working',
            ],
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error debugging admin blank page:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        suggestion: 'Check admin configuration and collection setup',
      },
      { status: 500 },
    )
  }
}
