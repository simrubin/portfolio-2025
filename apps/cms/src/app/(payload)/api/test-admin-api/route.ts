import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await testAdminAPI()
}

export async function POST() {
  return await testAdminAPI()
}

async function testAdminAPI() {
  try {
    const payload = await getPayload({ config })
    
    console.log('🔍 Testing admin API calls...')
    
    // Test the exact API call the admin interface should make
    const projects = await payload.find({
      collection: 'projects',
      limit: 10,
      page: 1,
      sort: '-updatedAt',
    })
    
    console.log('✅ Admin API test successful!')
    
    return NextResponse.json({
      success: true,
      message: 'Admin API test successful',
      data: {
        docs: projects.docs.map(doc => ({
          id: doc.id,
          title: doc.title,
          slug: doc.slug,
          publishedAt: doc.publishedAt,
          updatedAt: doc.updatedAt,
          _status: doc._status,
        })),
        totalDocs: projects.totalDocs,
        totalPages: projects.totalPages,
        page: projects.page,
        limit: projects.limit,
        hasNextPage: projects.hasNextPage,
        hasPrevPage: projects.hasPrevPage,
      },
    })
    
  } catch (error: any) {
    console.error('❌ Error testing admin API:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
