import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: Request) {
  return await debugAdminRequests(request)
}

export async function POST(request: Request) {
  return await debugAdminRequests(request)
}

async function debugAdminRequests(request: Request) {
  try {
    console.log('🔄 Debugging admin requests...')
    
    const payload = await getPayload({ config })
    
    // Get request headers and URL
    const url = new URL(request.url)
    const headers = Object.fromEntries(request.headers.entries())
    
    // Test different query parameters that the admin might use
    const testQueries = [
      // Basic query
      {
        name: 'Basic Query',
        query: {
          collection: 'projects',
          limit: 10,
          page: 1,
        },
      },
      // With sort
      {
        name: 'With Sort',
        query: {
          collection: 'projects',
          limit: 10,
          page: 1,
          sort: '-updatedAt',
        },
      },
      // With published filter
      {
        name: 'With Published Filter',
        query: {
          collection: 'projects',
          limit: 10,
          page: 1,
          sort: '-updatedAt',
          where: {
            _status: {
              equals: 'published',
            },
          },
        },
      },
      // With draft filter
      {
        name: 'With Draft Filter',
        query: {
          collection: 'projects',
          limit: 10,
          page: 1,
          sort: '-updatedAt',
          where: {
            _status: {
              equals: 'draft',
            },
          },
        },
      },
      // No status filter (all documents)
      {
        name: 'No Status Filter',
        query: {
          collection: 'projects',
          limit: 10,
          page: 1,
          sort: '-updatedAt',
          where: {},
        },
      },
    ]
    
    const results: any = {}
    
    for (const test of testQueries) {
      try {
        console.log(`🔄 Testing: ${test.name}`)
        
        const result = await payload.find(test.query as any)
        
        results[test.name] = {
          success: true,
          count: result.docs.length,
          totalDocs: result.totalDocs,
          totalPages: result.totalPages,
          page: result.page,
          limit: result.limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          docs: result.docs.map((doc: any) => ({
            id: doc.id,
            title: doc.title,
            slug: doc.slug,
            publishedAt: doc.publishedAt,
            updatedAt: doc.updatedAt,
            _status: doc._status,
          })),
        }
        
        console.log(`✅ ${test.name}: ${result.docs.length} docs`)
        
      } catch (error: any) {
        results[test.name] = {
          success: false,
          error: error.message,
        }
        console.log(`❌ ${test.name}: ${error.message}`)
      }
    }
    
    // Test the collection configuration
    const collectionConfig = payload.config.collections?.find(
      (collection) => collection.slug === 'projects'
    )
    
    // Test access control
    const accessControl = collectionConfig?.access || {}
    
    return NextResponse.json({
      success: true,
      message: 'Admin requests debugging completed',
      requestInfo: {
        url: url.toString(),
        method: request.method,
        headers: {
          'content-type': headers['content-type'],
          'user-agent': headers['user-agent'],
          'accept': headers['accept'],
        },
      },
      results,
      collectionConfig: {
        slug: collectionConfig?.slug,
        access: accessControl,
        admin: {
          useAsTitle: collectionConfig?.admin?.useAsTitle,
          defaultColumns: collectionConfig?.admin?.defaultColumns,
          pagination: collectionConfig?.admin?.pagination,
        },
      },
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    console.error('❌ Error debugging admin requests:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        suggestion: 'Check request format and collection configuration',
      },
      { status: 500 },
    )
  }
}
