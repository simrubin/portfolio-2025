import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    console.log('🔄 Creating projects from backup data...')

    const payload = await getPayload({ config })

    // Sample project data from the backup
    const projectsData = [
      {
        title: 'Romano Coffee Grinder',
        slug: 'romano-cg',
        publishedAt: '2023-07-19T14:00:00.000Z',
        year: 2023,
        newlyAdded: false,
        _status: 'published' as const,
        textBody: 'A premium coffee grinder designed for the modern kitchen.',
      },
      {
        title: 'Smart Canister',
        slug: 'smart-canister',
        publishedAt: '2023-11-19T13:00:00.000Z',
        year: 2023,
        newlyAdded: false,
        _status: 'published' as const,
        textBody: 'An intelligent storage solution for your pantry.',
      },
      {
        title: 'Designborne',
        slug: 'designborne',
        publishedAt: '2023-10-19T13:00:00.000Z',
        year: 2023,
        newlyAdded: false,
        _status: 'published' as const,
        textBody: 'A design agency website showcasing creative work.',
      },
      {
        title: 'Modifi M1',
        slug: 'modifi-m1',
        publishedAt: '2024-07-19T14:00:00.000Z',
        year: 2024,
        newlyAdded: false,
        _status: 'published' as const,
        textBody: 'A modular furniture system for flexible living spaces.',
      },
      {
        title: 'LEO',
        slug: 'leo',
        publishedAt: '2024-11-19T13:00:00.000Z',
        year: 2024,
        newlyAdded: false,
        _status: 'published' as const,
        textBody: 'A personal assistant app for productivity.',
      },
      {
        title: 'Machine Eye',
        slug: 'machine-eye',
        publishedAt: '2024-12-31T13:00:00.000Z',
        year: 2024,
        newlyAdded: false,
        _status: 'published' as const,
        textBody: 'Computer vision technology for industrial applications.',
      },
      {
        title: 'Emazey',
        slug: 'emazey',
        publishedAt: '2025-07-15T14:00:00.000Z',
        year: 2025,
        newlyAdded: false,
        _status: 'published' as const,
        textBody: 'An e-commerce platform for handmade goods.',
      },
      {
        title: 'Maincode Site',
        slug: 'maincode-site',
        publishedAt: '2025-10-14T13:00:00.000Z',
        year: 2025,
        newlyAdded: false,
        _status: 'published' as const,
        textBody: 'A developer portfolio website.',
      },
      {
        title: 'Matilda Demo',
        slug: 'matilda-demo',
        publishedAt: '2025-10-15T13:00:00.000Z',
        year: 2025,
        newlyAdded: false,
        _status: 'published' as const,
        textBody: 'A demonstration of the Matilda AI assistant.',
      },
    ]

    let createdCount = 0
    const results: any[] = []

    // Create projects
    for (const projectData of projectsData) {
      try {
        // Check if project already exists
        const existing = await payload.find({
          collection: 'projects',
          where: {
            slug: {
              equals: projectData.slug,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          results.push({
            slug: projectData.slug,
            status: 'already_exists',
            id: existing.docs[0].id,
          })
          continue
        }

        const created = await payload.create({
          collection: 'projects',
          data: projectData as any,
        })

        createdCount++
        results.push({
          slug: projectData.slug,
          status: 'created',
          id: created.id,
        })
      } catch (error: any) {
        results.push({
          slug: projectData.slug,
          status: 'error',
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Projects creation completed',
      summary: {
        created: createdCount,
        total: projectsData.length,
      },
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error creating projects:', error.message)
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
