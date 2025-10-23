import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  const POSTGRES_URL = process.env.POSTGRES_URL

  if (!POSTGRES_URL) {
    return NextResponse.json({ success: false, error: 'POSTGRES_URL is not set' }, { status: 500 })
  }

  const pgPool = new Pool({ connectionString: POSTGRES_URL })

  try {
    const client = await pgPool.connect()
    try {
      await client.query('BEGIN')

      // Add missing columns to media table
      await client.query(`
        ALTER TABLE media
        ADD COLUMN IF NOT EXISTS caption VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_thumbnail_url VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_thumbnail_width INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_thumbnail_height INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_thumbnail_mime_type VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_thumbnail_filesize INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_thumbnail_filename VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_square_url VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_square_width INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_square_height INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_square_mime_type VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_square_filesize INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_square_filename VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_small_url VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_small_width INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_small_height INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_small_mime_type VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_small_filesize INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_small_filename VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_medium_url VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_medium_width INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_medium_height INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_medium_mime_type VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_medium_filesize INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_medium_filename VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_large_url VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_large_width INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_large_height INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_large_mime_type VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_large_filesize INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_large_filename VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_xlarge_url VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_xlarge_width INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_xlarge_height INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_xlarge_mime_type VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_xlarge_filesize INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_xlarge_filename VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_og_url VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_og_width INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_og_height INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_og_mime_type VARCHAR,
        ADD COLUMN IF NOT EXISTS sizes_og_filesize INTEGER,
        ADD COLUMN IF NOT EXISTS sizes_og_filename VARCHAR;
      `)

      await client.query('COMMIT')

      return NextResponse.json({ 
        success: true, 
        message: 'All missing columns added to media table' 
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('Error adding columns to media table:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    await pgPool.end()
  }
}
