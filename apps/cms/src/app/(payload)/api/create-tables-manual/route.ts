import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  return await createTablesManual()
}

export async function POST() {
  return await createTablesManual()
}

async function createTablesManual() {
  try {
    console.log('🔄 Manually creating database tables...')
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({
        success: false,
        error: 'POSTGRES_URL not set',
      })
    }
    
    // Connect directly to Postgres
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    })
    
    const client = await pool.connect()
    
    try {
      console.log('📋 Creating tables manually...')
      
      // Create basic tables that Payload needs
      const createTablesSQL = `
        -- Create users table
        CREATE TABLE IF NOT EXISTS payload_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create projects table
        CREATE TABLE IF NOT EXISTS payload_projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          hero_image_id UUID,
          published_at TIMESTAMP,
          year INTEGER,
          newly_added BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create media table
        CREATE TABLE IF NOT EXISTS payload_media (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          filename VARCHAR(255),
          mime_type VARCHAR(100),
          filesize INTEGER,
          url VARCHAR(500),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create pages table
        CREATE TABLE IF NOT EXISTS payload_pages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create posts table
        CREATE TABLE IF NOT EXISTS payload_posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create categories table
        CREATE TABLE IF NOT EXISTS payload_categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
      
      await client.query(createTablesSQL)
      console.log('✅ Basic tables created successfully')
      
      // Check if tables exist
      const tableCheck = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name LIKE 'payload_%'
        ORDER BY table_name
      `)
      
      const tables = tableCheck.rows.map(row => row.table_name)
      
      // Test if we can insert a test user
      try {
        await client.query(`
          INSERT INTO payload_users (email, password, name) 
          VALUES ('test@example.com', 'hashedpassword', 'Test User')
          ON CONFLICT (email) DO NOTHING
        `)
        console.log('✅ Test user created successfully')
      } catch (insertError: any) {
        console.log('⚠️ Test user creation failed:', insertError.message)
      }
      
      // Test if we can insert a test project
      try {
        await client.query(`
          INSERT INTO payload_projects (title, slug, published_at, year) 
          VALUES ('Test Project', 'test-project', NOW(), 2024)
          ON CONFLICT (slug) DO NOTHING
        `)
        console.log('✅ Test project created successfully')
      } catch (insertError: any) {
        console.log('⚠️ Test project creation failed:', insertError.message)
      }
      
      console.log('✅ Manual table creation completed!')
      
      return NextResponse.json({
        success: true,
        message: 'Database tables created manually',
        tables: tables,
        timestamp: new Date().toISOString(),
      })
      
    } finally {
      client.release()
    }
    
  } catch (error: any) {
    console.error('❌ Error creating tables manually:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        suggestion: 'Check database connection and permissions',
      },
      { status: 500 },
    )
  }
}
