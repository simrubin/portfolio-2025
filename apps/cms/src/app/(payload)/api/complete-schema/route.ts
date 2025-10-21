import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Complete Payload schema including all system tables
const completeSchema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
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

CREATE TABLE "users_sessions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER NOT NULL,
  "_parent_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "expires_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL
);

-- Payload system tables
CREATE TABLE "payload_preferences" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "key" VARCHAR,
  "value" JSONB,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "payload_preferences_rels" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order" INTEGER,
  "parent_id" UUID NOT NULL REFERENCES "payload_preferences"("id") ON DELETE CASCADE,
  "path" VARCHAR NOT NULL,
  "users_id" UUID
);

CREATE TABLE "payload_locked_documents" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "global_slug" VARCHAR,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "payload_locked_documents_rels" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order" INTEGER,
  "parent_id" UUID NOT NULL REFERENCES "payload_locked_documents"("id") ON DELETE CASCADE,
  "path" VARCHAR NOT NULL,
  "pages_id" UUID,
  "posts_id" UUID,
  "media_id" UUID,
  "categories_id" UUID,
  "users_id" UUID,
  "projects_id" UUID,
  "redirects_id" UUID,
  "forms_id" UUID,
  "form_submissions_id" UUID,
  "search_id" UUID,
  "payload_jobs_id" UUID
);

CREATE TABLE "payload_migrations" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR,
  "batch" NUMERIC,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX "users_created_at_idx" ON "users" ("created_at");
CREATE INDEX "users_sessions_order_idx" ON "users_sessions" ("_order");
CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" ("_parent_id");
CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" ("key");
CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" ("created_at");
CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" ("order");
CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" ("parent_id");
CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" ("path");
CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" ("created_at");
CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" ("global_slug");
CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" ("order");
CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" ("parent_id");
CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" ("path");
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
    console.log('🔧 Creating complete Payload schema...')
    
    const client = await pool.connect()
    
    try {
      // Clear database
      await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
      console.log('✅ Database cleared')
      
      // Create complete schema
      await client.query(completeSchema)
      console.log('✅ Complete schema created')
      
      // Verify tables
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `)
      
      const tables = result.rows.map(row => row.table_name)
      console.log('📋 Created tables:', tables)
      
      return NextResponse.json({
        success: true,
        message: 'Complete Payload schema created with all system tables',
        tables: tables,
        nextStep: 'Go to /admin to create your first user'
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Schema creation failed:', error)
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
