import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await debugDatabase()
}

export async function POST() {
  return await debugDatabase()
}

async function debugDatabase() {
  try {
    const payload = await getPayload({ config })
    
    console.log('🔍 Debugging database connection...')
    
    const results: any = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        POSTGRES_URL: process.env.POSTGRES_URL ? 'Set (hidden)' : 'Not set',
        DATABASE_URI: process.env.DATABASE_URI || 'Not set',
        VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL || 'Not set',
        NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'Not set',
      },
      database: {
        adapter: payload.db ? 'Connected' : 'Not connected',
        type: 'Unknown',
      },
      tests: {},
    }
    
    // Test 1: Check database adapter type
    try {
      const db = payload.db
      if (db) {
        // Try to determine database type
        if ('execute' in db) {
          results.database.type = 'Postgres (Drizzle)'
        } else {
          results.database.type = 'SQLite'
        }
      }
    } catch (error: any) {
      results.database.type = `Error: ${error.message}`
    }
    
    // Test 2: Try to query projects table
    try {
      const projects = await payload.find({
        collection: 'projects',
        limit: 1,
      })
      results.tests.projectsQuery = {
        success: true,
        count: projects.docs.length,
        message: 'Projects collection accessible',
      }
    } catch (error: any) {
      results.tests.projectsQuery = {
        success: false,
        error: error.message,
        message: 'Projects collection not accessible',
      }
    }
    
    // Test 3: Try to query users table
    try {
      const users = await payload.find({
        collection: 'users',
        limit: 1,
      })
      results.tests.usersQuery = {
        success: true,
        count: users.docs.length,
        message: 'Users collection accessible',
      }
    } catch (error: any) {
      results.tests.usersQuery = {
        success: false,
        error: error.message,
        message: 'Users collection not accessible',
      }
    }
    
    // Test 4: Check if we're using the right database
    try {
      const db = payload.db
      if (db && 'execute' in db) {
        results.tests.directPostgresQuery = {
          success: true,
          message: 'Using Postgres adapter (Drizzle)',
        }
      } else {
        results.tests.directPostgresQuery = {
          success: false,
          message: 'Not using Postgres adapter',
        }
      }
    } catch (error: any) {
      results.tests.directPostgresQuery = {
        success: false,
        error: error.message,
        message: 'Database adapter check failed',
      }
    }
    
    // Test 5: Check environment variables in detail
    results.environmentDetails = {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      hasDatabaseUri: !!process.env.DATABASE_URI,
      postgresUrlLength: process.env.POSTGRES_URL?.length || 0,
      databaseUriLength: process.env.DATABASE_URI?.length || 0,
    }
    
    console.log('✅ Database debugging completed')
    
    return NextResponse.json({
      success: true,
      message: 'Database debugging completed',
      ...results,
    })
    
  } catch (error: any) {
    console.error('❌ Error debugging database:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
