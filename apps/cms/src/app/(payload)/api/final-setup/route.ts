import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Minimal schema that matches exactly what Payload expects
const minimalSchema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with exact Payload structure
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "email" VARCHAR NOT NULL UNIQUE,
  "reset_password_token" VARCHAR,
  "reset_password_expiration" TIMESTAMP(3) WITHOUT TIME ZONE,
  "salt" VARCHAR,
  "hash" VARCHAR,
  "login_attempts" NUMERIC DEFAULT 0,
  "lock_until" TIMESTAMP(3) WITHOUT TIME ZONE,
  "name" VARCHAR
);

-- Create users_sessions table
CREATE TABLE "users_sessions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER NOT NULL,
  "_parent_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "expires_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL
);

-- Create essential indexes
CREATE INDEX "users_created_at_idx" ON "users" ("created_at");
CREATE INDEX "users_sessions_order_idx" ON "users_sessions" ("_order");
CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" ("_parent_id");
`

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
    console.log('🔧 Setting up minimal Payload schema for user creation...')
    
    const client = await pool.connect()
    
    try {
      // Clear database
      await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
      console.log('✅ Database cleared')
      
      // Create minimal schema for users only
      await client.query(minimalSchema)
      console.log('✅ Minimal schema created')
      
      // Verify users table exists
      const result = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND table_schema = 'public'
        ORDER BY ordinal_position
      `)
      
      console.log('📋 Users table columns:', result.rows)
      
      return NextResponse.json({
        success: true,
        message: 'Minimal schema created - users table ready',
        columns: result.rows,
        nextStep: 'Go to /admin to create your first user. Other tables will be created automatically as needed.'
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Setup failed:', error)
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
