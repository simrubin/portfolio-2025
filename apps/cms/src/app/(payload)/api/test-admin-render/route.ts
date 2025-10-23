import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await testAdminRender()
}

export async function POST() {
  return await testAdminRender()
}

async function testAdminRender() {
  try {
    console.log('🔄 Testing admin interface rendering...')
    
    const payload = await getPayload({ config })
    
    // Check if the admin interface is properly configured
    const adminConfig = payload.config.admin
    const collections = payload.config.collections || []
    const projectsCollection = collections.find((c) => c.slug === 'projects')
    
    // Test if we can access the admin interface programmatically
    let adminInterfaceTest = null
    try {
      // Test if we can access the admin interface
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
    
    // Test if we can access the Projects collection with admin interface parameters
    let adminProjectsTest = null
    try {
      const adminProjects = await payload.find({
        collection: 'projects',
        limit: 10,
        page: 1,
        sort: '-updatedAt',
      })
      
      adminProjectsTest = {
        success: true,
        count: adminProjects.docs.length,
        totalDocs: adminProjects.totalDocs,
        page: adminProjects.page,
        limit: adminProjects.limit,
        message: 'Admin interface can access projects with admin parameters',
      }
    } catch (error: any) {
      adminProjectsTest = {
        success: false,
        error: error.message,
        message: 'Admin interface cannot access projects with admin parameters',
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
      defaultPopulate: projectsCollection?.defaultPopulate,
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
    
    if (projectsCollection && projectsCollection.access && Object.keys(projectsCollection.access).length === 0) {
      issues.push('Projects collection access control is empty')
    }
    
    if (projectsCollection && (!projectsCollection.fields || projectsCollection.fields.length === 0)) {
      issues.push('Projects collection has no fields')
    }
    
    // Check if the collection has the required fields
    const requiredFields = ['title', 'slug', 'publishedAt', 'updatedAt']
    const missingFields = requiredFields.filter(
      (field) => !projectsCollection?.fields?.some((f) => 'name' in f && f.name === field),
    )
    
    if (missingFields.length > 0) {
      issues.push(`Missing required fields: ${missingFields.join(', ')}`)
    }
    
    // Check if there are any issues with the admin configuration
    const adminIssues = []
    
    if (adminConfig && !adminConfig.user) {
      adminIssues.push('Admin config has no user collection specified')
    }
    
    if (adminConfig && !adminConfig.components) {
      adminIssues.push('Admin config has no components specified')
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
      message: 'Admin interface rendering test completed',
      adminConfig: adminConfigCheck,
      projectsConfig: projectsConfigCheck,
      adminInterfaceTest,
      projectsTest,
      adminProjectsTest,
      issues,
      adminIssues,
      envCheck,
      suggestions: [
        'Check browser console for JavaScript errors',
        'Verify admin interface is loading properly',
        'Check if there are any network errors',
        'Verify authentication is working',
        'Check if there are any CORS issues',
        'Verify all required fields are present',
        'Check if there are any access control issues',
        'Check if there are any admin interface configuration issues',
      ],
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    console.error('❌ Error testing admin interface rendering:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        suggestion: 'Check admin interface configuration and rendering issues',
      },
      { status: 500 },
    )
  }
}
