import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await debugProjects()
}

export async function POST() {
  return await debugProjects()
}

async function debugProjects() {
  try {
    const payload = await getPayload({ config })
    
    console.log('🔍 Debugging Projects collection...')
    
    // Check if projects collection exists
    const collections = payload.config.collections
    const projectsConfig = collections?.find(col => col.slug === 'projects')
    
    if (!projectsConfig) {
      return NextResponse.json({
        success: false,
        message: 'Projects collection not found in config',
        availableCollections: collections?.map(col => col.slug) || [],
      })
    }
    
    // Try to fetch projects with different access levels
    const results: any = {
      collectionConfig: {
        slug: projectsConfig.slug,
        access: projectsConfig.access,
        admin: projectsConfig.admin,
      },
      tests: {},
    }
    
    // Test 1: Try to fetch projects with default access
    try {
      const anyoneProjects = await payload.find({
        collection: 'projects',
        limit: 5,
      })
      results.tests.anyoneAccess = {
        success: true,
        count: anyoneProjects.docs.length,
        docs: anyoneProjects.docs.map(doc => ({
          id: doc.id,
          title: doc.title,
          slug: doc.slug,
          publishedAt: doc.publishedAt,
        })),
      }
    } catch (error: any) {
      results.tests.anyoneAccess = {
        success: false,
        error: error.message,
      }
    }
    
    // Test 2: Try to fetch projects with published status
    try {
      const publishedProjects = await payload.find({
        collection: 'projects',
        where: {
          _status: {
            equals: 'published',
          },
        },
        limit: 5,
      })
      results.tests.publishedStatus = {
        success: true,
        count: publishedProjects.docs.length,
        docs: publishedProjects.docs.map(doc => ({
          id: doc.id,
          title: doc.title,
          slug: doc.slug,
          publishedAt: doc.publishedAt,
          _status: doc._status,
        })),
      }
    } catch (error: any) {
      results.tests.publishedStatus = {
        success: false,
        error: error.message,
      }
    }
    
    // Test 3: Check all projects without any filters
    try {
      const allProjects = await payload.find({
        collection: 'projects',
        limit: 10,
      })
      results.tests.allProjects = {
        success: true,
        count: allProjects.docs.length,
        docs: allProjects.docs.map(doc => ({
          id: doc.id,
          title: doc.title,
          slug: doc.slug,
          publishedAt: doc.publishedAt,
          _status: doc._status,
        })),
      }
    } catch (error: any) {
      results.tests.allProjects = {
        success: false,
        error: error.message,
      }
    }
    
    // Test 4: Check if there are any projects with publishedAt
    try {
      const publishedAtProjects = await payload.find({
        collection: 'projects',
        where: {
          publishedAt: {
            exists: true,
          },
        },
        limit: 5,
      })
      results.tests.publishedAtOnly = {
        success: true,
        count: publishedAtProjects.docs.length,
        docs: publishedAtProjects.docs.map(doc => ({
          id: doc.id,
          title: doc.title,
          slug: doc.slug,
          publishedAt: doc.publishedAt,
        })),
      }
    } catch (error: any) {
      results.tests.publishedAtOnly = {
        success: false,
        error: error.message,
      }
    }
    
    console.log('✅ Projects debugging completed')
    
    return NextResponse.json({
      success: true,
      message: 'Projects collection debugging completed',
      ...results,
    })
    
  } catch (error: any) {
    console.error('❌ Error debugging projects:', error.message)
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
