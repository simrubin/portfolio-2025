import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await testAdminCollection()
}

export async function POST() {
  return await testAdminCollection()
}

async function testAdminCollection() {
  try {
    console.log('🔄 Testing admin collection API...')
    
    const payload = await getPayload({ config })
    
    // Test the exact API call the admin interface makes
    const adminAPIResponse = await payload.find({
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
    
    console.log('✅ Admin API call successful')
    
    // Test with different access levels
    const anyoneAccess = await payload.find({
      collection: 'projects',
      limit: 10,
      page: 1,
      sort: '-updatedAt',
    })
    
    // Test with no filters
    const noFilters = await payload.find({
      collection: 'projects',
      limit: 10,
      page: 1,
    })
    
    // Test the collection config
    const collectionConfig = payload.config.collections?.find(
      (collection) => collection.slug === 'projects'
    )
    
    return NextResponse.json({
      success: true,
      message: 'Admin collection API test completed',
      results: {
        adminAPI: {
          success: true,
          count: adminAPIResponse.docs.length,
          totalDocs: adminAPIResponse.totalDocs,
          totalPages: adminAPIResponse.totalPages,
          page: adminAPIResponse.page,
          limit: adminAPIResponse.limit,
          hasNextPage: adminAPIResponse.hasNextPage,
          hasPrevPage: adminAPIResponse.hasPrevPage,
          docs: adminAPIResponse.docs.map(doc => ({
            id: doc.id,
            title: doc.title,
            slug: doc.slug,
            publishedAt: doc.publishedAt,
            updatedAt: doc.updatedAt,
            _status: doc._status,
          })),
        },
        anyoneAccess: {
          success: true,
          count: anyoneAccess.docs.length,
          totalDocs: anyoneAccess.totalDocs,
        },
        noFilters: {
          success: true,
          count: noFilters.docs.length,
          totalDocs: noFilters.totalDocs,
        },
        collectionConfig: {
          slug: collectionConfig?.slug,
          access: collectionConfig?.access,
          admin: {
            useAsTitle: collectionConfig?.admin?.useAsTitle,
            defaultColumns: collectionConfig?.admin?.defaultColumns,
            pagination: collectionConfig?.admin?.pagination,
          },
        },
      },
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    console.error('❌ Error testing admin collection:', error.message)
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
