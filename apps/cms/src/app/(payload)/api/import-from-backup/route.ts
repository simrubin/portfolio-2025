import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import fs from 'fs'
import path from 'path'

export async function GET() {
  return await importFromBackup()
}

export async function POST() {
  return await importFromBackup()
}

async function importFromBackup() {
  try {
    console.log('🔄 Starting import from backup data...')

    const payload = await getPayload({ config })

    // Read the exported data
    const backupDir = path.join(process.cwd(), '..', '..', 'data-backup')
    const projectsPath = path.join(backupDir, 'projects-full-export.json')
    const mediaPath = path.join(backupDir, 'media-full-export.json')

    if (!fs.existsSync(projectsPath)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Projects backup file not found',
          path: projectsPath,
        },
        { status: 404 },
      )
    }

    if (!fs.existsSync(mediaPath)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Media backup file not found',
          path: mediaPath,
        },
        { status: 404 },
      )
    }

    // Read backup data
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))
    const mediaData = JSON.parse(fs.readFileSync(mediaPath, 'utf8'))

    console.log(`📊 Found ${projectsData.projects.length} projects to import`)
    console.log(`📊 Found ${mediaData.media.length} media records to import`)

    // First, import media records
    const mediaMap = new Map()
    let mediaImported = 0

    for (const mediaItem of mediaData.media) {
      try {
        // Check if media already exists
        const existing = await payload.find({
          collection: 'media',
          where: {
            filename: {
              equals: mediaItem.filename,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          mediaMap.set(mediaItem.id, existing.docs[0])
          continue
        }

        // Create media record
        const created = await payload.create({
          collection: 'media',
          data: {
            alt: mediaItem.alt,
            caption: mediaItem.caption,
            url: mediaItem.url,
            thumbnailURL: mediaItem.thumbnail_u_r_l,
            filename: mediaItem.filename,
            mimeType: mediaItem.mime_type,
            filesize: mediaItem.filesize,
            width: mediaItem.width,
            height: mediaItem.height,
            focalX: mediaItem.focal_x,
            focalY: mediaItem.focal_y,
            sizes: {
              thumbnail: {
                url: mediaItem.sizes_thumbnail_url,
                width: mediaItem.sizes_thumbnail_width,
                height: mediaItem.sizes_thumbnail_height,
                mimeType: mediaItem.sizes_thumbnail_mime_type,
                filesize: mediaItem.sizes_thumbnail_filesize,
                filename: mediaItem.sizes_thumbnail_filename,
              },
              square: {
                url: mediaItem.sizes_square_url,
                width: mediaItem.sizes_square_width,
                height: mediaItem.sizes_square_height,
                mimeType: mediaItem.sizes_square_mime_type,
                filesize: mediaItem.sizes_square_filesize,
                filename: mediaItem.sizes_square_filename,
              },
              small: {
                url: mediaItem.sizes_small_url,
                width: mediaItem.sizes_small_width,
                height: mediaItem.sizes_small_height,
                mimeType: mediaItem.sizes_small_mime_type,
                filesize: mediaItem.sizes_small_filesize,
                filename: mediaItem.sizes_small_filename,
              },
              medium: {
                url: mediaItem.sizes_medium_url,
                width: mediaItem.sizes_medium_width,
                height: mediaItem.sizes_medium_height,
                mimeType: mediaItem.sizes_medium_mime_type,
                filesize: mediaItem.sizes_medium_filesize,
                filename: mediaItem.sizes_medium_filename,
              },
              large: {
                url: mediaItem.sizes_large_url,
                width: mediaItem.sizes_large_width,
                height: mediaItem.sizes_large_height,
                mimeType: mediaItem.sizes_large_mime_type,
                filesize: mediaItem.sizes_large_filesize,
                filename: mediaItem.sizes_large_filename,
              },
              xlarge: {
                url: mediaItem.sizes_xlarge_url,
                width: mediaItem.sizes_xlarge_width,
                height: mediaItem.sizes_xlarge_height,
                mimeType: mediaItem.sizes_xlarge_mime_type,
                filesize: mediaItem.sizes_xlarge_filesize,
                filename: mediaItem.sizes_xlarge_filename,
              },
              og: {
                url: mediaItem.sizes_og_url,
                width: mediaItem.sizes_og_width,
                height: mediaItem.sizes_og_height,
                mimeType: mediaItem.sizes_og_mime_type,
                filesize: mediaItem.sizes_og_filesize,
                filename: mediaItem.sizes_og_filename,
              },
            },
          },
        })

        mediaMap.set(mediaItem.id, created)
        mediaImported++
      } catch (error: any) {
        console.error(`❌ Error importing media ${mediaItem.filename}:`, error.message)
      }
    }

    console.log(`✅ Imported ${mediaImported} media records`)

    // Now import projects
    let projectsImported = 0
    const results = []

    for (const projectData of projectsData.projects) {
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
            title: projectData.title,
            status: 'already_exists',
          })
          continue
        }

        // Get hero image if it exists
        let heroImage = null
        if (projectData.hero_image_id && mediaMap.has(projectData.hero_image_id)) {
          heroImage = mediaMap.get(projectData.hero_image_id).id
        }

        // Create project data
        const projectCreateData: any = {
          title: projectData.title,
          slug: projectData.slug,
          publishedAt: projectData.published_at,
          year: projectData.year,
          newlyAdded: Boolean(projectData.newly_added),
          _status: projectData._status,
        }

        if (heroImage) {
          projectCreateData.heroImage = heroImage
        }

        // Create the project
        const created = await payload.create({
          collection: 'projects',
          data: projectCreateData,
        })

        // Import sections if they exist
        if (projectData.sections && projectData.sections.length > 0) {
          try {
            await payload.update({
              collection: 'projects',
              id: created.id,
              data: {
                sections: projectData.sections.map((section: any) => ({
                  sectionTitle: section.section_title,
                  textBody: section.text_body,
                })),
              },
            })
          } catch (sectionError: any) {
            console.error(
              `❌ Error importing sections for ${projectData.slug}:`,
              sectionError.message,
            )
          }
        }

        projectsImported++
        results.push({
          slug: projectData.slug,
          title: projectData.title,
          status: 'created',
          id: created.id,
        })
      } catch (error: any) {
        console.error(`❌ Error importing project ${projectData.slug}:`, error.message)
        results.push({
          slug: projectData.slug,
          title: projectData.title,
          status: 'error',
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed successfully`,
      summary: {
        projectsImported,
        mediaImported,
        totalProjects: projectsData.projects.length,
        totalMedia: mediaData.media.length,
      },
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error importing from backup:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
