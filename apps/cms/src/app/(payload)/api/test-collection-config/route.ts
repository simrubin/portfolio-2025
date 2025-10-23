import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await testCollectionConfig()
}

export async function POST() {
  return await testCollectionConfig()
}

async function testCollectionConfig() {
  try {
    console.log('🔄 Testing collection configuration...')

    const payload = await getPayload({ config })

    // Get the raw collection configuration
    const rawConfig = payload.config
    const collections = rawConfig.collections || []

    // Find the projects collection
    const projectsCollection = collections.find((c) => c.slug === 'projects')

    if (!projectsCollection) {
      return NextResponse.json({
        success: false,
        error: 'Projects collection not found in configuration',
        availableCollections: collections.map((c) => c.slug),
      })
    }

    // Test the access control functions
    const accessControl = projectsCollection.access || {}

    // Test each access control function
    const accessTests: any = {}

    for (const [operation, accessFn] of Object.entries(accessControl)) {
      try {
        // Test the access function with a mock request
        const mockReq = {
          user: null,
          headers: {},
        }

        const result = await accessFn(mockReq as any)
        accessTests[operation] = {
          success: true,
          result: result,
          type: typeof result,
        }
      } catch (error: any) {
        accessTests[operation] = {
          success: false,
          error: error.message,
        }
      }
    }

    // Test if the collection can be accessed through the admin interface
    let adminAccessTest = null
    try {
      // This is what the admin interface should do
      const result = await payload.find({
        collection: 'projects',
        limit: 1,
        page: 1,
      })

      adminAccessTest = {
        success: true,
        count: result.docs.length,
        totalDocs: result.totalDocs,
        message: 'Collection accessible through admin interface',
      }
    } catch (error: any) {
      adminAccessTest = {
        success: false,
        error: error.message,
        message: 'Collection not accessible through admin interface',
      }
    }

    // Check if there are any issues with the collection configuration
    const issues = []

    if (!projectsCollection.admin) {
      issues.push('No admin configuration')
    }

    if (!projectsCollection.access) {
      issues.push('No access control configuration')
    }

    if (projectsCollection.access && Object.keys(projectsCollection.access).length === 0) {
      issues.push('Access control is empty object')
    }

    if (!projectsCollection.fields || projectsCollection.fields.length === 0) {
      issues.push('No fields configured')
    }

    // Check if the collection has the required fields for admin display
    const requiredFields = ['title', 'slug', 'publishedAt', 'updatedAt']
    const missingFields = requiredFields.filter(
      (field) => !projectsCollection.fields?.some((f) => 'name' in f && f.name === field),
    )

    if (missingFields.length > 0) {
      issues.push(`Missing required fields: ${missingFields.join(', ')}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Collection configuration test completed',
      collection: {
        slug: projectsCollection.slug,
        admin: projectsCollection.admin,
        access: projectsCollection.access,
        fields: projectsCollection.fields?.map((f) => ('name' in f ? f.name : 'unknown')) || [],
        versions: projectsCollection.versions,
      },
      accessTests,
      adminAccessTest,
      issues,
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
            ],
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error testing collection configuration:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        suggestion: 'Check collection configuration and access control',
      },
      { status: 500 },
    )
  }
}
