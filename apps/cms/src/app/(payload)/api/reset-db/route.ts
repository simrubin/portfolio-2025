import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json(
      { success: false, error: 'POSTGRES_URL environment variable is not set' },
      { status: 500 },
    )
  }

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })

  try {
    console.log('🔧 Resetting database...')

    const client = await pool.connect()

    try {
      // Drop all tables and recreate the schema (Neon-compatible)
      await client.query(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `)

      console.log('✅ Database reset successfully')

      return NextResponse.json({
        success: true,
        message: 'Database reset successfully',
        nextSteps: [
          '1. Go to /admin',
          '2. Create your first user',
          '3. Payload will automatically create all tables',
          '4. Then you can import your data',
        ],
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Database reset failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  } finally {
    await pool.end()
  }
}
