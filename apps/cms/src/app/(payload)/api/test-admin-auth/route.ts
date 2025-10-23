import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: Request) {
  return await testAdminAuth(request)
}

export async function POST(request: Request) {
  return await testAdminAuth(request)
}

async function testAdminAuth(request: Request) {
  try {
    console.log('🔄 Testing admin authentication...')
    
    const payload = await getPayload({ config })
    
    // Get request headers
    const headers = Object.fromEntries(request.headers.entries())
    const origin = headers.origin || headers.referer || 'unknown'
    
    console.log('Request origin:', origin)
    console.log('Request headers:', {
      'user-agent': headers['user-agent'],
      'accept': headers['accept'],
      'origin': headers.origin,
      'referer': headers.referer,
      'authorization': headers.authorization ? 'Present' : 'Not present',
      'cookie': headers.cookie ? 'Present' : 'Not present',
    })
    
    // Test if we can access the projects collection without authentication
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
        message: 'Projects accessible without authentication',
      }
    } catch (error: any) {
      projectsTest = {
        success: false,
        error: error.message,
        message: 'Projects not accessible without authentication',
      }
    }
    
    // Test if we can access the projects collection with authentication
    let projectsWithAuthTest = null
    try {
      // Try to find a user first
      const users = await payload.find({
        collection: 'users',
        limit: 1,
      })
      
      if (users.docs.length > 0) {
        const user = users.docs[0]
        
        // Test with user context
        const projectsWithAuth = await payload.find({
          collection: 'projects',
          limit: 5,
          req: {
            user: user,
          } as any,
        })
        
        projectsWithAuthTest = {
          success: true,
          count: projectsWithAuth.docs.length,
          totalDocs: projectsWithAuth.totalDocs,
          message: 'Projects accessible with authentication',
          userId: user.id,
        }
      } else {
        projectsWithAuthTest = {
          success: false,
          error: 'No users found',
          message: 'Cannot test with authentication - no users found',
        }
      }
    } catch (error: any) {
      projectsWithAuthTest = {
        success: false,
        error: error.message,
        message: 'Projects not accessible with authentication',
      }
    }
    
    // Test the collection access control
    const collectionConfig = payload.config.collections?.find(
      (collection) => collection.slug === 'projects'
    )
    
    const accessControl = collectionConfig?.access || {}
    
    // Test each access control function
    const accessTests: any = {}
    
    for (const [operation, accessFn] of Object.entries(accessControl)) {
      try {
        // Test with no user (unauthenticated)
        const mockReq = {
          user: null,
          headers: {},
        }
        
        const result = await (accessFn as any)(mockReq as any)
        accessTests[operation] = {
          success: true,
          result: result,
          type: typeof result,
          message: `Access control for ${operation} returned: ${result}`,
        }
      } catch (error: any) {
        accessTests[operation] = {
          success: false,
          error: error.message,
          message: `Access control for ${operation} failed: ${error.message}`,
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin authentication test completed',
      request: {
        origin: origin,
        method: request.method,
        headers: {
          'user-agent': headers['user-agent'],
          'accept': headers['accept'],
          'origin': headers.origin,
          'referer': headers.referer,
          'authorization': headers.authorization ? 'Present' : 'Not present',
          'cookie': headers.cookie ? 'Present' : 'Not present',
        },
      },
      tests: {
        projectsWithoutAuth: projectsTest,
        projectsWithAuth: projectsWithAuthTest,
        accessControl: accessTests,
      },
      collectionConfig: {
        slug: collectionConfig?.slug,
        access: accessControl,
        admin: collectionConfig?.admin,
      },
      suggestions: [
        'Check if admin interface is properly authenticated',
        'Verify access control is working correctly',
        'Check if CORS is preventing requests',
        'Verify collection configuration is correct',
      ],
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    console.error('❌ Error testing admin authentication:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        suggestion: 'Check admin authentication and access control',
      },
      { status: 500 },
    )
  }
}
