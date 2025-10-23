import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await fixProjectsAccess()
}

export async function POST() {
  return await fixProjectsAccess()
}

async function fixProjectsAccess() {
  try {
    console.log('🔄 Fixing Projects collection access control...')
    
    const payload = await getPayload({ config })
    
    // Get the current collection configuration
    const collections = payload.config.collections || []
    const projectsCollection = collections.find((c) => c.slug === 'projects')
    
    if (!projectsCollection) {
      return NextResponse.json({
        success: false,
        error: 'Projects collection not found',
      })
    }
    
    // Check current access control
    const currentAccess = projectsCollection.access || {}
    console.log('Current access control:', currentAccess)
    
    // Test the access control functions
    const accessTests: any = {}
    
    for (const [operation, accessFn] of Object.entries(currentAccess)) {
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
    
    // Check if the access control is empty
    const isEmpty = Object.keys(currentAccess).length === 0
    
    return NextResponse.json({
      success: true,
      message: 'Projects access control analysis completed',
      currentAccess,
      isEmpty,
      accessTests,
      issues: isEmpty ? ['Access control is empty'] : [],
      suggestions: isEmpty ? [
        'The Projects collection has empty access control',
        'This is causing the admin interface to fail',
        'Need to ensure access control is properly configured',
        'Check if there is a runtime issue with access control functions',
      ] : [
        'Access control is configured',
        'Check if there are runtime issues with access control functions',
        'Verify access control functions are working correctly',
      ],
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    console.error('❌ Error fixing Projects access control:', error.message)
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
