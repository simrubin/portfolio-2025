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
    console.log('🔧 Clearing database and forcing fresh initialization...')
    
    const client = await pool.connect()
    
    try {
      // Drop all tables to start fresh
      await client.query(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `)
      
      console.log('✅ Database cleared successfully')
      
      return NextResponse.json({
        success: true,
        message: 'Database cleared. Payload will create schema on next admin access.',
        nextStep: 'Go to /admin - Payload will automatically create the correct schema'
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Clear failed:', error)
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
