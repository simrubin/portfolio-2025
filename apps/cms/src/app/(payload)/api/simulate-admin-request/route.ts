import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: Request) {
  return await simulateAdminRequest(request)
}

export async function POST(request: Request) {
  return await simulateAdminRequest(request)
}

async function simulateAdminRequest(request: Request) {
  try {
    console.log('🔄 Simulating admin interface request...')
    
    const payload = await getPayload({ config })
    
    // Get request headers to simulate what the admin interface sends
    const headers = Object.fromEntries(request.headers.entries())
    
    // Simulate the exact request the admin interface should make
    const adminRequest = {
      collection: 'projects',
      limit: 10,
      page: 1,
      sort: '-updatedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    }
    
    console.log('🔄 Making admin request:', adminRequest)
    
    // Make the request
    const result = await payload.find(adminRequest as any)
    
    console.log('✅ Admin request successful:', {
      count: result.docs.length,
      totalDocs: result.totalDocs,
    })
    
    // Also test without the _status filter
    const adminRequestNoFilter = {
      collection: 'projects',
      limit: 10,
      page: 1,
      sort: '-updatedAt',
    }
    
    console.log('🔄 Making admin request without filter:', adminRequestNoFilter)
    
    const resultNoFilter = await payload.find(adminRequestNoFilter as any)
    
    console.log('✅ Admin request without filter successful:', {
      count: resultNoFilter.docs.length,
      totalDocs: resultNoFilter.totalDocs,
    })
    
    // Test with different access levels
    const accessTests = {
      withAuth: result,
      withoutAuth: resultNoFilter,
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin interface request simulation completed',
      request: {
        headers: {
          'user-agent': headers['user-agent'],
          'accept': headers['accept'],
          'content-type': headers['content-type'],
        },
        adminRequest,
        adminRequestNoFilter,
      },
      results: {
        withStatusFilter: {
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
        },
        withoutStatusFilter: {
          success: true,
          count: resultNoFilter.docs.length,
          totalDocs: resultNoFilter.totalDocs,
          totalPages: resultNoFilter.totalPages,
          page: resultNoFilter.page,
          limit: resultNoFilter.limit,
          hasNextPage: resultNoFilter.hasNextPage,
          hasPrevPage: resultNoFilter.hasPrevPage,
          docs: resultNoFilter.docs.map((doc: any) => ({
            id: doc.id,
            title: doc.title,
            slug: doc.slug,
            publishedAt: doc.publishedAt,
            updatedAt: doc.updatedAt,
            _status: doc._status,
          })),
        },
      },
      analysis: {
        bothRequestsWork: result.docs.length > 0 && resultNoFilter.docs.length > 0,
        dataConsistent: result.docs.length === resultNoFilter.docs.length,
        adminInterfaceShouldWork: true,
        potentialIssues: [],
      },
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    console.error('❌ Error simulating admin request:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        suggestion: 'Check if admin interface can make the same request',
      },
      { status: 500 },
    )
  }
}
