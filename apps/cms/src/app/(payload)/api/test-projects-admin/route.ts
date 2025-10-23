import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    console.log('🔍 Testing Projects collection admin interface...')

    const payload = await getPayload({ config })

    // Test the exact query that the admin interface would make
    const adminQuery = {
      collection: 'projects',
      limit: 10,
      page: 1,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    }

    console.log('📊 Running admin query:', JSON.stringify(adminQuery, null, 2))

    const result = await payload.find(adminQuery as any)

    console.log('✅ Admin query successful:', {
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      docsCount: result.docs.length,
    })

    // Test without status filter
    const allQuery = {
      collection: 'projects',
      limit: 10,
      page: 1,
      sort: '-publishedAt',
    }

    console.log('📊 Running all projects query...')
    const allResult = await payload.find(allQuery as any)

    console.log('✅ All projects query successful:', {
      totalDocs: allResult.totalDocs,
      docsCount: allResult.docs.length,
    })

    return NextResponse.json({
      success: true,
      message: 'Projects admin interface test completed',
      adminQuery: {
        query: adminQuery,
        result: {
          totalDocs: result.totalDocs,
          totalPages: result.totalPages,
          page: result.page,
          limit: result.limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          docsCount: result.docs.length,
          firstDoc: result.docs[0] ? {
            id: result.docs[0].id,
            title: result.docs[0].title,
            slug: result.docs[0].slug,
            publishedAt: result.docs[0].publishedAt,
            _status: result.docs[0]._status,
          } : null,
        },
      },
      allQuery: {
        query: allQuery,
        result: {
          totalDocs: allResult.totalDocs,
          docsCount: allResult.docs.length,
        },
      },
      suggestions: [
        'Check if admin interface is making the correct API calls',
        'Verify browser console for JavaScript errors',
        'Check if the admin interface is properly configured',
        'Ensure the Projects collection has proper admin configuration',
      ],
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error testing projects admin:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
