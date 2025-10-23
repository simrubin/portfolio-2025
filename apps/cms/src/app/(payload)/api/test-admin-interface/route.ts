import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await testAdminInterface()
}

export async function POST() {
  return await testAdminInterface()
}

async function testAdminInterface() {
  try {
    console.log('🔄 Testing admin interface configuration...')

    const payload = await getPayload({ config })

    // Check if the admin interface is properly configured
    const adminConfig = payload.config.admin
    const collections = payload.config.collections || []

    // Check if the Projects collection is properly configured
    const projectsCollection = collections.find((c) => c.slug === 'projects')

    // Test if we can access the admin interface
    let adminInterfaceTest = null
    try {
      // Test if we can access the admin interface programmatically
      const adminData = await payload.find({
        collection: 'users',
        limit: 1,
      })

      adminInterfaceTest = {
        success: true,
        message: 'Admin interface is accessible',
        userCount: adminData.totalDocs,
      }
    } catch (error: any) {
      adminInterfaceTest = {
        success: false,
        error: error.message,
        message: 'Admin interface is not accessible',
      }
    }

    // Test if we can access the Projects collection
    let projectsTest = null
    try {
      const projects = await payload.find({
        collection: 'projects',
        limit: 5,
      })

      projectsTest = {
        success: true,
        count: projects.docs.length,
        totalDocs: projects.totalDocs,
        message: 'Projects collection is accessible',
      }
    } catch (error: any) {
      projectsTest = {
        success: false,
        error: error.message,
        message: 'Projects collection is not accessible',
      }
    }

    // Check the admin configuration
    const adminConfigCheck = {
      exists: !!adminConfig,
      user: adminConfig?.user,
      components: adminConfig?.components,
      importMap: adminConfig?.importMap,
    }

    // Check the Projects collection configuration
    const projectsConfigCheck = {
      exists: !!projectsCollection,
      slug: projectsCollection?.slug,
      admin: projectsCollection?.admin,
      access: projectsCollection?.access,
      fields: projectsCollection?.fields?.length || 0,
      versions: projectsCollection?.versions,
    }

    // Check if there are any issues
    const issues = []

    if (!adminConfig) {
      issues.push('No admin configuration found')
    }

    if (!projectsCollection) {
      issues.push('Projects collection not found')
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

    // Check if the collection has the required fields
    const requiredFields = ['title', 'slug', 'publishedAt', 'updatedAt']
    const missingFields = requiredFields.filter(
      (field) => !projectsCollection?.fields?.some((f) => 'name' in f && f.name === field),
    )

    if (missingFields.length > 0) {
      issues.push(`Missing required fields: ${missingFields.join(', ')}`)
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
      message: 'Admin interface test completed',
      adminConfig: adminConfigCheck,
      projectsConfig: projectsConfigCheck,
      adminInterfaceTest,
      projectsTest,
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
              'Configuration looks correct',
              'Check browser console for JavaScript errors',
              'Verify admin interface is loading properly',
              'Check if there are any network errors',
              'Verify authentication is working',
            ],
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error testing admin interface:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        suggestion: 'Check admin interface configuration',
      },
      { status: 500 },
    )
  }
}
