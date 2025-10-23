import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import path from 'path'
import fs from 'fs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return new NextResponse('Filename required', { status: 400 })
    }

    const payload = await getPayload({ config })
    
    // Get the media collection configuration
    const mediaCollection = payload.config.collections.find(c => c.slug === 'media')
    if (!mediaCollection?.upload?.staticDir) {
      return new NextResponse('Media collection not configured', { status: 500 })
    }

    const filePath = path.join(mediaCollection.upload.staticDir, filename)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath)
    
    // Get file extension to determine content type
    const ext = path.extname(filename).toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.svg':
        contentType = 'image/svg+xml'
        break
      case '.mp4':
        contentType = 'video/mp4'
        break
      case '.webm':
        contentType = 'video/webm'
        break
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })
  } catch (error: any) {
    console.error('Error serving media file:', error.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
