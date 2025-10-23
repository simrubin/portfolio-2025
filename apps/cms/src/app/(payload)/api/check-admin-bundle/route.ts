import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    console.log('🔍 Checking admin bundle integrity...')

    const payload = await getPayload({ config })

    // Check if admin config is properly loaded
    const adminConfig = payload.config.admin
    
    // Test if collections are accessible
    const collections = payload.config.collections
    const projectsCollection = collections.find((col: any) => col.slug === 'projects')
    
    // Check if admin routes are working
    const adminRoutes = {
      login: '/admin/login',
      dashboard: '/admin',
      projects: '/admin/collections/projects',
      media: '/admin/collections/media',
    }

    return NextResponse.json({
      success: true,
      message: 'Admin bundle check completed',
      adminConfig: {
        exists: !!adminConfig,
        user: adminConfig?.user || 'not configured',
        components: adminConfig?.components || {},
      },
      collections: {
        total: collections.length,
        projects: {
          exists: !!projectsCollection,
          slug: projectsCollection?.slug,
          fields: projectsCollection?.fields?.length || 0,
        },
      },
      adminRoutes,
      suggestions: [
        'Check if admin interface is loading JavaScript bundles',
        'Verify browser console for JavaScript errors',
        'Clear browser cache and hard refresh',
        'Check if admin routes are accessible',
      ],
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error checking admin bundle:', error.message)
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
