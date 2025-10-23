import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await debugAdminFrontend()
}

export async function POST() {
  return await debugAdminFrontend()
}

async function debugAdminFrontend() {
  try {
    console.log('🔄 Debugging admin frontend configuration...')

    const payload = await getPayload({ config })

    // Check admin configuration
    const adminConfig = payload.config.admin

    // Check collections configuration
    const collections = payload.config.collections || []
    const projectsCollection = collections.find((c) => c.slug === 'projects')

    // Check if admin routes are properly configured
    const adminRoutes = {
      login: '/admin/login',
      dashboard: '/admin',
      collections: '/admin/collections',
      projects: '/admin/collections/projects',
    }

    // Check environment variables that might affect frontend
    const frontendEnv = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
      VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ? 'Set' : 'Not set',
    }

    // Test if we can access the admin interface programmatically
    let adminAccessTest = null
    try {
      // This simulates what the admin interface should do
      const adminData = await payload.find({
        collection: 'users',
        limit: 1,
      })
      adminAccessTest = {
        success: true,
        message: 'Admin interface can access collections',
        userCount: adminData.totalDocs,
      }
    } catch (error: any) {
      adminAccessTest = {
        success: false,
        error: error.message,
        message: 'Admin interface cannot access collections',
      }
    }

    // Check if there are any potential issues with the collection configuration
    const collectionIssues = []

    if (!projectsCollection) {
      collectionIssues.push('Projects collection not found in configuration')
    } else {
      if (!projectsCollection.admin) {
        collectionIssues.push('Projects collection has no admin configuration')
      }
      if (!projectsCollection.access) {
        collectionIssues.push('Projects collection has no access control')
      }
      if (projectsCollection.access && Object.keys(projectsCollection.access).length === 0) {
        collectionIssues.push('Projects collection access control is empty object')
      }
    }

    // Check if there are any potential issues with the admin configuration
    const adminIssues = []

    if (!adminConfig) {
      adminIssues.push('No admin configuration found')
    } else {
      if (!adminConfig.user) {
        adminIssues.push('No admin user configuration')
      }
      if (!adminConfig.meta) {
        adminIssues.push('No admin meta configuration')
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Admin frontend debugging completed',
      adminConfig: {
        exists: !!adminConfig,
        user: adminConfig?.user,
        meta: adminConfig?.meta,
        components: adminConfig?.components,
        // css: adminConfig?.css, // Not available in this version
      },
      projectsCollection: {
        exists: !!projectsCollection,
        slug: projectsCollection?.slug,
        admin: projectsCollection?.admin,
        access: projectsCollection?.access,
        fields: projectsCollection?.fields?.length || 0,
      },
      adminRoutes,
      frontendEnv,
      adminAccessTest,
      issues: {
        collection: collectionIssues,
        admin: adminIssues,
      },
      suggestions: [
        'Check browser console for JavaScript errors',
        'Verify admin interface is loading correctly',
        'Check if authentication is working properly',
        'Verify collection configuration is correct',
        'Check if there are any CORS issues',
      ],
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error debugging admin frontend:', error.message)
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
