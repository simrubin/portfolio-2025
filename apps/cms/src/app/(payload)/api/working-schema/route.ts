import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// PostgreSQL schema converted from working SQLite database
const workingSchema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (matches local SQLite structure)
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "email" VARCHAR NOT NULL,
  "reset_password_token" VARCHAR,
  "reset_password_expiration" TIMESTAMP(3) WITHOUT TIME ZONE,
  "salt" VARCHAR,
  "hash" VARCHAR,
  "login_attempts" NUMERIC DEFAULT 0,
  "lock_until" TIMESTAMP(3) WITHOUT TIME ZONE
);

-- Media table (matches local SQLite structure with all size variants)
CREATE TABLE "media" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "alt" VARCHAR,
  "caption" VARCHAR,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "url" VARCHAR,
  "thumbnail_u_r_l" VARCHAR,
  "filename" VARCHAR,
  "mime_type" VARCHAR,
  "filesize" NUMERIC,
  "width" NUMERIC,
  "height" NUMERIC,
  "focal_x" NUMERIC,
  "focal_y" NUMERIC,
  "sizes_thumbnail_url" VARCHAR,
  "sizes_thumbnail_width" NUMERIC,
  "sizes_thumbnail_height" NUMERIC,
  "sizes_thumbnail_mime_type" VARCHAR,
  "sizes_thumbnail_filesize" NUMERIC,
  "sizes_thumbnail_filename" VARCHAR,
  "sizes_square_url" VARCHAR,
  "sizes_square_width" NUMERIC,
  "sizes_square_height" NUMERIC,
  "sizes_square_mime_type" VARCHAR,
  "sizes_square_filesize" NUMERIC,
  "sizes_square_filename" VARCHAR,
  "sizes_small_url" VARCHAR,
  "sizes_small_width" NUMERIC,
  "sizes_small_height" NUMERIC,
  "sizes_small_mime_type" VARCHAR,
  "sizes_small_filesize" NUMERIC,
  "sizes_small_filename" VARCHAR,
  "sizes_medium_url" VARCHAR,
  "sizes_medium_width" NUMERIC,
  "sizes_medium_height" NUMERIC,
  "sizes_medium_mime_type" VARCHAR,
  "sizes_medium_filesize" NUMERIC,
  "sizes_medium_filename" VARCHAR,
  "sizes_large_url" VARCHAR,
  "sizes_large_width" NUMERIC,
  "sizes_large_height" NUMERIC,
  "sizes_large_mime_type" VARCHAR,
  "sizes_large_filesize" NUMERIC,
  "sizes_large_filename" VARCHAR,
  "sizes_xlarge_url" VARCHAR,
  "sizes_xlarge_width" NUMERIC,
  "sizes_xlarge_height" NUMERIC,
  "sizes_xlarge_mime_type" VARCHAR,
  "sizes_xlarge_filesize" NUMERIC,
  "sizes_xlarge_filename" VARCHAR,
  "sizes_og_url" VARCHAR,
  "sizes_og_width" NUMERIC,
  "sizes_og_height" NUMERIC,
  "sizes_og_mime_type" VARCHAR,
  "sizes_og_filesize" NUMERIC,
  "sizes_og_filename" VARCHAR
);

-- Projects table (matches local SQLite structure)
CREATE TABLE "projects" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "slug" VARCHAR,
  "hero_image_id" UUID,
  "published_at" TIMESTAMP(3) WITHOUT TIME ZONE,
  "year" NUMERIC,
  "newly_added" BOOLEAN,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "_status" VARCHAR DEFAULT 'draft',
  FOREIGN KEY ("hero_image_id") REFERENCES "media"("id") ON DELETE SET NULL
);

-- Projects sections table (matches local SQLite structure)
CREATE TABLE "projects_sections" (
  "_order" INTEGER NOT NULL,
  "_parent_id" UUID NOT NULL,
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "section_title" VARCHAR,
  "text_body" TEXT,
  FOREIGN KEY ("_parent_id") REFERENCES "projects"("id") ON DELETE CASCADE
);

-- Projects sections media table (matches local SQLite structure)
CREATE TABLE "projects_sections_media" (
  "_order" INTEGER NOT NULL,
  "_parent_id" UUID NOT NULL,
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "media_item_id" UUID,
  "caption" VARCHAR,
  FOREIGN KEY ("media_item_id") REFERENCES "media"("id") ON DELETE SET NULL,
  FOREIGN KEY ("_parent_id") REFERENCES "projects_sections"("id") ON DELETE CASCADE
);

-- Add other essential tables that Payload needs
CREATE TABLE "pages" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "slug" VARCHAR,
  "published_at" TIMESTAMP(3) WITHOUT TIME ZONE,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "_status" VARCHAR DEFAULT 'draft'
);

CREATE TABLE "posts" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "slug" VARCHAR,
  "content" JSONB,
  "published_at" TIMESTAMP(3) WITHOUT TIME ZONE,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "_status" VARCHAR DEFAULT 'draft'
);

CREATE TABLE "categories" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "header" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "footer" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "redirects" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "from" VARCHAR,
  "to_type" VARCHAR DEFAULT 'reference',
  "to_url" VARCHAR,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Payload system tables
CREATE TABLE "payload_preferences" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "key" VARCHAR,
  "value" JSONB,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "payload_locked_documents" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "global_slug" VARCHAR,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "payload_migrations" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR,
  "batch" NUMERIC,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create all indexes (matching local SQLite structure)
CREATE INDEX "users_updated_at_idx" ON "users" ("updated_at");
CREATE INDEX "users_created_at_idx" ON "users" ("created_at");
CREATE UNIQUE INDEX "users_email_idx" ON "users" ("email");

CREATE INDEX "media_updated_at_idx" ON "media" ("updated_at");
CREATE INDEX "media_created_at_idx" ON "media" ("created_at");
CREATE UNIQUE INDEX "media_filename_idx" ON "media" ("filename");

CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" ("slug");
CREATE INDEX "projects_hero_image_idx" ON "projects" ("hero_image_id");
CREATE INDEX "projects_updated_at_idx" ON "projects" ("updated_at");
CREATE INDEX "projects_created_at_idx" ON "projects" ("created_at");
CREATE INDEX "projects__status_idx" ON "projects" ("_status");

CREATE INDEX "projects_sections_order_idx" ON "projects_sections" ("_order");
CREATE INDEX "projects_sections_parent_id_idx" ON "projects_sections" ("_parent_id");

CREATE INDEX "projects_sections_media_order_idx" ON "projects_sections_media" ("_order");
CREATE INDEX "projects_sections_media_parent_id_idx" ON "projects_sections_media" ("_parent_id");
CREATE INDEX "projects_sections_media_media_item_idx" ON "projects_sections_media" ("media_item_id");

CREATE INDEX "pages_slug_idx" ON "pages" ("slug");
CREATE INDEX "pages_created_at_idx" ON "pages" ("created_at");
CREATE INDEX "pages_status_idx" ON "pages" ("_status");

CREATE INDEX "posts_slug_idx" ON "posts" ("slug");
CREATE INDEX "posts_created_at_idx" ON "posts" ("created_at");
CREATE INDEX "posts_status_idx" ON "posts" ("_status");

CREATE INDEX "categories_created_at_idx" ON "categories" ("created_at");

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
    console.log('🔧 Creating working schema based on local SQLite database...')

    const client = await pool.connect()

    try {
      // Clear database
      await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
      console.log('✅ Database cleared')

      // Create working schema
      await client.query(workingSchema)
      console.log('✅ Working schema created')

      // Verify tables
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
        message: 'Working schema created successfully based on local SQLite database',
        tables: tables,
        nextStep: 'Go to /admin to create your first user, then run the import script',
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Working schema creation failed:', error)
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
