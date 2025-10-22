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

-- Content collections
CREATE TABLE "projects" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR NOT NULL,
  "slug" VARCHAR,
  "hero_image_id" UUID,
  "tagline" VARCHAR,
  "description" TEXT,
  "tech_stack" JSONB,
  "github_url" VARCHAR,
  "live_url" VARCHAR,
  "published_at" TIMESTAMP(3) WITHOUT TIME ZONE,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "_status" VARCHAR DEFAULT 'draft'
);

CREATE TABLE "projects_sections" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER NOT NULL,
  "_parent_id" UUID NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "title" VARCHAR,
  "content" TEXT
);

CREATE TABLE "projects_sections_media" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER NOT NULL,
  "_parent_id" UUID NOT NULL REFERENCES "projects_sections"("id") ON DELETE CASCADE,
  "media_item_id" UUID,
  "caption" VARCHAR
);

CREATE TABLE "media" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "alt" VARCHAR,
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
  "focal_y" NUMERIC
);

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
  "to_type" VARCHAR,
  "to_url" VARCHAR,
  "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert default globals
INSERT INTO "header" ("id") VALUES ('00000000-0000-0000-0000-000000000001');
INSERT INTO "footer" ("id") VALUES ('00000000-0000-0000-0000-000000000002');

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
CREATE INDEX "projects_slug_idx" ON "projects" ("slug");
CREATE INDEX "projects_created_at_idx" ON "projects" ("created_at");
CREATE INDEX "projects_status_idx" ON "projects" ("_status");
CREATE INDEX "projects_sections_order_idx" ON "projects_sections" ("_order");
CREATE INDEX "projects_sections_parent_idx" ON "projects_sections" ("_parent_id");
CREATE INDEX "projects_sections_media_order_idx" ON "projects_sections_media" ("_order");
CREATE INDEX "projects_sections_media_parent_idx" ON "projects_sections_media" ("_parent_id");
CREATE INDEX "media_created_at_idx" ON "media" ("created_at");
CREATE INDEX "pages_slug_idx" ON "pages" ("slug");
CREATE INDEX "pages_created_at_idx" ON "pages" ("created_at");
CREATE INDEX "pages_status_idx" ON "pages" ("_status");
CREATE INDEX "posts_slug_idx" ON "posts" ("slug");
CREATE INDEX "posts_created_at_idx" ON "posts" ("created_at");
CREATE INDEX "posts_status_idx" ON "posts" ("_status");
CREATE INDEX "categories_created_at_idx" ON "categories" ("created_at");
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

      const tables = result.rows.map((row) => row.table_name)
      console.log('📋 Created tables:', tables)

      return NextResponse.json({
        success: true,
        message: 'Complete Payload schema created with all system tables',
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
