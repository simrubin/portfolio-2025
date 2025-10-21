import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// This is the exact schema that Payload's Vercel Postgres adapter creates
const payloadSchema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (auth enabled)
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "email" VARCHAR NOT NULL,
  "resetPasswordToken" VARCHAR,
  "resetPasswordExpiration" TIMESTAMP(3) WITHOUT TIME ZONE,
  "salt" VARCHAR,
  "hash" VARCHAR,
  "loginAttempts" NUMERIC DEFAULT 0,
  "lockUntil" TIMESTAMP(3) WITHOUT TIME ZONE,
  "name" VARCHAR
);

-- Users sessions table
CREATE TABLE "users_sessions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER NOT NULL,
  "_parent_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "expiresAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL
);

-- Pages table
CREATE TABLE "pages" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "hero_type" VARCHAR DEFAULT 'none',
  "hero_rich_text" JSONB,
  "hero_media_id" UUID,
  "meta_title" VARCHAR,
  "meta_image_id" UUID,
  "meta_description" TEXT,
  "publishedAt" TIMESTAMP(3) WITHOUT TIME ZONE,
  "generateSlug" BOOLEAN DEFAULT true,
  "slug" VARCHAR,
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "_status" VARCHAR DEFAULT 'draft'
);

-- Posts table
CREATE TABLE "posts" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "content" JSONB,
  "meta_title" VARCHAR,
  "meta_description" TEXT,
  "meta_image_id" UUID,
  "publishedAt" TIMESTAMP(3) WITHOUT TIME ZONE,
  "slug" VARCHAR,
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "_status" VARCHAR DEFAULT 'draft'
);

-- Media table
CREATE TABLE "media" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "alt" VARCHAR,
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "url" VARCHAR,
  "thumbnail_u_r_l" VARCHAR,
  "filename" VARCHAR,
  "mime_type" VARCHAR,
  "filesize" NUMERIC,
  "width" NUMERIC,
  "height" NUMERIC,
  "focal_x" NUMERIC,
  "focal_y" NUMERIC
);

-- Categories table
CREATE TABLE "categories" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Projects table
CREATE TABLE "projects" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "description" TEXT,
  "image_id" UUID,
  "tech_stack" JSONB,
  "github_url" VARCHAR,
  "live_url" VARCHAR,
  "featured" BOOLEAN DEFAULT false,
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "_status" VARCHAR DEFAULT 'draft'
);

-- Header global
CREATE TABLE "header" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Footer global
CREATE TABLE "footer" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Redirects table
CREATE TABLE "redirects" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "from" VARCHAR,
  "to_type" VARCHAR DEFAULT 'reference',
  "to_url" VARCHAR,
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create unique constraints
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE ("email");
ALTER TABLE "pages" ADD CONSTRAINT "pages_slug_unique" UNIQUE ("slug");
ALTER TABLE "posts" ADD CONSTRAINT "posts_slug_unique" UNIQUE ("slug");

-- Create indexes
CREATE INDEX "users_createdAt_idx" ON "users" ("createdAt");
CREATE INDEX "users_sessions_order_idx" ON "users_sessions" ("_order");
CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" ("_parent_id");
CREATE INDEX "pages_createdAt_idx" ON "pages" ("createdAt");
CREATE INDEX "pages_status_idx" ON "pages" ("_status");
CREATE INDEX "posts_createdAt_idx" ON "posts" ("createdAt");
CREATE INDEX "posts_status_idx" ON "posts" ("_status");
CREATE INDEX "media_createdAt_idx" ON "media" ("createdAt");
CREATE INDEX "categories_createdAt_idx" ON "categories" ("createdAt");
CREATE INDEX "projects_createdAt_idx" ON "projects" ("createdAt");
CREATE INDEX "projects_status_idx" ON "projects" ("_status");
CREATE INDEX "header_createdAt_idx" ON "header" ("createdAt");
CREATE INDEX "footer_createdAt_idx" ON "footer" ("createdAt");
CREATE INDEX "redirects_createdAt_idx" ON "redirects" ("createdAt");

-- Insert default globals
INSERT INTO "header" ("id") VALUES ('00000000-0000-0000-0000-000000000001');
INSERT INTO "footer" ("id") VALUES ('00000000-0000-0000-0000-000000000002');
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
    console.log('🔧 Creating exact Payload schema...')

    const client = await pool.connect()

    try {
      // First clear everything
      await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
      console.log('✅ Database cleared')

      // Create the exact schema Payload expects
      await client.query(payloadSchema)
      console.log('✅ Payload schema created successfully')

      // Verify tables exist
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `)

      const tables = result.rows.map((row) => row.table_name)
      console.log('📋 Created tables:', tables)

      return NextResponse.json({
        success: true,
        message: 'Exact Payload schema created successfully',
        tables: tables,
        nextStep: 'Go to /admin to create your first user',
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
