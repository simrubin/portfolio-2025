import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const filename = formData.get('filename') as string

    if (!file || !filename) {
      return NextResponse.json({ error: 'File and filename required' }, { status: 400 })
    }

    // Create backup directory
    const backupDir = path.join(process.cwd(), 'data-backup')
    await mkdir(backupDir, { recursive: true })

    // Write file
    const filePath = path.join(backupDir, filename)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      message: `File ${filename} uploaded successfully`,
      path: filePath,
    })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    )
  }
}
