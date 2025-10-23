import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await fixImageUrls()
}

export async function POST() {
  return await fixImageUrls()
}

async function fixImageUrls() {
  try {
    console.log('🔄 Fixing image URLs in projects...')

    const payload = await getPayload({ config })

    // Get all projects
    const projects = await payload.find({
      collection: 'projects',
      limit: 100,
    })

    console.log(`Found ${projects.docs.length} projects to fix`)

    let fixedCount = 0
    const results = []

    for (const project of projects.docs) {
      let needsUpdate = false
      const updates: any = {}

      // Fix hero image URLs
      if (project.heroImage && typeof project.heroImage === 'object') {
        const heroImage = project.heroImage as any
        
        if (heroImage.url && !heroImage.url.startsWith('/api/media/file/')) {
          updates.heroImage = {
            ...heroImage,
            url: `/api/media/file/${heroImage.filename}`,
            thumbnailURL: heroImage.filename ? `/api/media/file/${heroImage.filename.replace(/\.[^/.]+$/, '')}-300x${Math.round(300 * (heroImage.height || 1) / (heroImage.width || 1))}.${heroImage.filename.split('.').pop()}` : null,
          }
          needsUpdate = true
        }
      }

      // Fix section media URLs
      if (project.sections && Array.isArray(project.sections)) {
        const updatedSections = project.sections.map((section: any) => {
          if (section.media && Array.isArray(section.media)) {
            const updatedMedia = section.media.map((mediaItem: any) => {
              if (mediaItem.mediaItem && typeof mediaItem.mediaItem === 'object') {
                const media = mediaItem.mediaItem
                if (media.url && !media.url.startsWith('/api/media/file/')) {
                  return {
                    ...mediaItem,
                    mediaItem: {
                      ...media,
                      url: `/api/media/file/${media.filename}`,
                      thumbnailURL: media.filename ? `/api/media/file/${media.filename.replace(/\.[^/.]+$/, '')}-300x${Math.round(300 * (media.height || 1) / (media.width || 1))}.${media.filename.split('.').pop()}` : null,
                    }
                  }
                }
              }
              return mediaItem
            })
            return { ...section, media: updatedMedia }
          }
          return section
        })
        
        if (JSON.stringify(updatedSections) !== JSON.stringify(project.sections)) {
          updates.sections = updatedSections
          needsUpdate = true
        }
      }

      if (needsUpdate) {
        try {
          await payload.update({
            collection: 'projects',
            id: project.id,
            data: updates,
          })
          fixedCount++
          results.push({
            id: project.id,
            title: project.title,
            status: 'fixed',
            updates: Object.keys(updates),
          })
        } catch (error: any) {
          results.push({
            id: project.id,
            title: project.title,
            status: 'error',
            error: error.message,
          })
        }
      } else {
        results.push({
          id: project.id,
          title: project.title,
          status: 'no_changes_needed',
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed image URLs for ${fixedCount} projects`,
      totalProjects: projects.docs.length,
      fixedCount,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error fixing image URLs:', error.message)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
