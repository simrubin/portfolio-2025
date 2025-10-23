import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  return await testDbConnection()
}

export async function POST() {
  return await testDbConnection()
}

async function testDbConnection() {
  try {
    console.log('🔍 Testing direct Postgres connection...')
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({
        success: false,
        message: 'POSTGRES_URL not set',
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          POSTGRES_URL: 'Not set',
        },
      })
    }
    
    // Test direct connection to Postgres
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    })
    
    const client = await pool.connect()
    
    try {
      // Test basic connection
      const result = await client.query('SELECT NOW() as current_time')
      
      // Test if projects table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'payload_projects'
        ) as table_exists
      `)
      
      // Test projects count
      const projectsCount = await client.query('SELECT COUNT(*) as count FROM payload_projects')
      
      // Test users count
      const usersCount = await client.query('SELECT COUNT(*) as count FROM payload_users')
      
      console.log('✅ Direct Postgres connection successful!')
      
      return NextResponse.json({
        success: true,
        message: 'Direct Postgres connection successful',
        data: {
          currentTime: result.rows[0].current_time,
          projectsTableExists: tableCheck.rows[0].table_exists,
          projectsCount: projectsCount.rows[0].count,
          usersCount: usersCount.rows[0].count,
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          POSTGRES_URL: 'Set (hidden)',
          postgresUrlLength: process.env.POSTGRES_URL.length,
        },
      })
      
    } finally {
      client.release()
    }
    
  } catch (error: any) {
    console.error('❌ Error testing database connection:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          POSTGRES_URL: process.env.POSTGRES_URL ? 'Set (hidden)' : 'Not set',
        },
      },
      { status: 500 },
    )
  }
}
