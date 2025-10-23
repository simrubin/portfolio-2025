import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await debugAdminJS()
}

export async function POST() {
  return await debugAdminJS()
}

async function debugAdminJS() {
  try {
    console.log('🔄 Debugging admin JavaScript issues...')
    
    const payload = await getPayload({ config })
    
    // Check if the admin interface is properly configured
    const adminConfig = payload.config.admin
    const collections = payload.config.collections || []
    const projectsCollection = collections.find((c) => c.slug === 'projects')
    
    // Test if we can access the projects collection with different query parameters
    const queryTests = []
    
    // Test 1: Basic query
    try {
      const basicQuery = await payload.find({
        collection: 'projects',
        limit: 5,
      })
      queryTests.push({
        name: 'Basic Query',
        success: true,
        count: basicQuery.docs.length,
        totalDocs: basicQuery.totalDocs,
      })
    } catch (error: any) {
      queryTests.push({
        name: 'Basic Query',
        success: false,
        error: error.message,
      })
    }
    
    // Test 2: Query with pagination
    try {
      const paginationQuery = await payload.find({
        collection: 'projects',
        limit: 10,
        page: 1,
      })
      queryTests.push({
        name: 'Pagination Query',
        success: true,
        count: paginationQuery.docs.length,
        totalDocs: paginationQuery.totalDocs,
        page: paginationQuery.page,
        limit: paginationQuery.limit,
      })
    } catch (error: any) {
      queryTests.push({
        name: 'Pagination Query',
        success: false,
        error: error.message,
      })
    }
    
    // Test 3: Query with sort
    try {
      const sortQuery = await payload.find({
        collection: 'projects',
        limit: 10,
        page: 1,
        sort: '-updatedAt',
      })
      queryTests.push({
        name: 'Sort Query',
        success: true,
        count: sortQuery.docs.length,
        totalDocs: sortQuery.totalDocs,
        sort: '-updatedAt',
      })
    } catch (error: any) {
      queryTests.push({
        name: 'Sort Query',
        success: false,
        error: error.message,
      })
    }
    
    // Test 4: Query with where clause
    try {
      const whereQuery = await payload.find({
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
      queryTests.push({
        name: 'Where Query',
        success: true,
        count: whereQuery.docs.length,
        totalDocs: whereQuery.totalDocs,
        where: '_status equals published',
      })
    } catch (error: any) {
      queryTests.push({
        name: 'Where Query',
        success: false,
        error: error.message,
      })
    }
    
    // Test 5: Query with populate
    try {
      const populateQuery = await payload.find({
        collection: 'projects',
        limit: 5,
      })
      queryTests.push({
        name: 'Populate Query',
        success: true,
        count: populateQuery.docs.length,
        totalDocs: populateQuery.totalDocs,
        populate: 'none',
      })
    } catch (error: any) {
      queryTests.push({
        name: 'Populate Query',
        success: false,
        error: error.message,
      })
    }
    
    // Check the collection configuration
    const collectionConfig = {
      exists: !!projectsCollection,
      slug: projectsCollection?.slug,
      admin: projectsCollection?.admin,
      access: projectsCollection?.access,
      fields: projectsCollection?.fields?.length || 0,
      versions: projectsCollection?.versions,
      defaultPopulate: projectsCollection?.defaultPopulate,
    }
    
    // Check if there are any issues with the collection
    const issues = []
    
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
    
    // Check if the collection has the required fields for admin display
    const requiredFields = ['title', 'slug', 'publishedAt', 'updatedAt']
    const missingFields = requiredFields.filter(
      (field) => !projectsCollection?.fields?.some((f) => 'name' in f && f.name === field),
    )
    
    if (missingFields.length > 0) {
      issues.push(`Missing required fields: ${missingFields.join(', ')}`)
    }
    
    // Check if there are any issues with the admin configuration
    const adminIssues = []
    
    if (!adminConfig) {
      adminIssues.push('No admin configuration found')
    }
    
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
      message: 'Admin JavaScript debugging completed',
      adminConfig: {
        exists: !!adminConfig,
        user: adminConfig?.user,
        components: adminConfig?.components,
        importMap: adminConfig?.importMap,
      },
      collectionConfig,
      queryTests,
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
      ],
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    console.error('❌ Error debugging admin JavaScript:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        suggestion: 'Check admin interface configuration and JavaScript errors',
      },
      { status: 500 },
    )
  }
}
