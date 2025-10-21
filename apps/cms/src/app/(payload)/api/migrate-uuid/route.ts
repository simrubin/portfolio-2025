import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const createTablesSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS "pages_blocks_cta_links" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_content_columns" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_cta" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_content" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_media_block" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_archive" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_form_block" CASCADE;
DROP TABLE IF EXISTS "pages_rels" CASCADE;
DROP TABLE IF EXISTS "header_rels" CASCADE;
DROP TABLE IF EXISTS "footer_rels" CASCADE;
DROP TABLE IF EXISTS "redirects_rels" CASCADE;
DROP TABLE IF EXISTS "pages_hero_links" CASCADE;
DROP TABLE IF EXISTS "header_nav_items" CASCADE;
DROP TABLE IF EXISTS "footer_nav_items" CASCADE;
DROP TABLE IF EXISTS "users_sessions" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "pages" CASCADE;
DROP TABLE IF EXISTS "posts" CASCADE;
DROP TABLE IF EXISTS "media" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "projects" CASCADE;
DROP TABLE IF EXISTS "header" CASCADE;
DROP TABLE IF EXISTS "footer" CASCADE;
DROP TABLE IF EXISTS "redirects" CASCADE;

-- Create users table
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "email" VARCHAR UNIQUE NOT NULL,
  "reset_password_token" VARCHAR,
  "reset_password_expiration" TIMESTAMP WITH TIME ZONE,
  "salt" VARCHAR,
  "hash" VARCHAR,
  "login_attempts" INTEGER DEFAULT 0,
  "lock_until" TIMESTAMP WITH TIME ZONE
);

-- Create users_sessions table
CREATE TABLE "users_sessions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "expires_at" TIMESTAMP WITH TIME ZONE
);

-- Create pages table
CREATE TABLE "pages" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "hero_type" VARCHAR DEFAULT 'none',
  "hero_rich_text" JSONB,
  "hero_media_id" UUID,
  "meta_title" VARCHAR,
  "meta_image_id" UUID,
  "meta_description" TEXT,
  "published_at" TIMESTAMP WITH TIME ZONE,
  "generate_slug" BOOLEAN DEFAULT true,
  "slug" VARCHAR,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "_status" VARCHAR DEFAULT 'draft'
);

-- Create pages_hero_links table
CREATE TABLE "pages_hero_links" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "pages"("id") ON DELETE CASCADE,
  "link_type" VARCHAR DEFAULT 'reference',
  "link_new_tab" BOOLEAN,
  "link_url" VARCHAR,
  "link_label" VARCHAR,
  "link_appearance" VARCHAR DEFAULT 'default'
);

-- Create posts table
CREATE TABLE "posts" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "content" JSONB,
  "meta_title" VARCHAR,
  "meta_description" TEXT,
  "meta_image_id" UUID,
  "published_at" TIMESTAMP WITH TIME ZONE,
  "slug" VARCHAR,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "_status" VARCHAR DEFAULT 'draft'
);

-- Create media table
CREATE TABLE "media" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "alt" VARCHAR,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "url" VARCHAR,
  "thumbnail_u_r_l" VARCHAR,
  "filename" VARCHAR,
  "mime_type" VARCHAR,
  "filesize" INTEGER,
  "width" INTEGER,
  "height" INTEGER,
  "focal_x" DECIMAL,
  "focal_y" DECIMAL
);

-- Create categories table
CREATE TABLE "categories" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE "projects" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR,
  "description" TEXT,
  "image_id" UUID,
  "tech_stack" JSONB,
  "github_url" VARCHAR,
  "live_url" VARCHAR,
  "featured" BOOLEAN DEFAULT false,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "_status" VARCHAR DEFAULT 'draft'
);

-- Create header table
CREATE TABLE "header" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create header_nav_items table
CREATE TABLE "header_nav_items" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "header"("id") ON DELETE CASCADE,
  "link_type" VARCHAR DEFAULT 'reference',
  "link_new_tab" BOOLEAN,
  "link_url" VARCHAR,
  "link_label" VARCHAR
);

-- Create footer table
CREATE TABLE "footer" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create footer_nav_items table
CREATE TABLE "footer_nav_items" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "footer"("id") ON DELETE CASCADE,
  "link_type" VARCHAR DEFAULT 'reference',
  "link_new_tab" BOOLEAN,
  "link_url" VARCHAR,
  "link_label" VARCHAR
);

-- Create redirects table
CREATE TABLE "redirects" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "from" VARCHAR,
  "to_type" VARCHAR DEFAULT 'reference',
  "to_url" VARCHAR,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relation tables
CREATE TABLE "header_rels" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order" INTEGER,
  "parent_id" UUID REFERENCES "header"("id") ON DELETE CASCADE,
  "path" VARCHAR,
  "pages_id" UUID,
  "posts_id" UUID
);

CREATE TABLE "footer_rels" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order" INTEGER,
  "parent_id" UUID REFERENCES "footer"("id") ON DELETE CASCADE,
  "path" VARCHAR,
  "pages_id" UUID,
  "posts_id" UUID
);

CREATE TABLE "redirects_rels" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order" INTEGER,
  "parent_id" UUID REFERENCES "redirects"("id") ON DELETE CASCADE,
  "path" VARCHAR,
  "pages_id" UUID,
  "posts_id" UUID
);

-- Create block tables for pages
CREATE TABLE "pages_blocks_cta" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" VARCHAR,
  "rich_text" JSONB,
  "block_name" VARCHAR
);

CREATE TABLE "pages_blocks_content" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" VARCHAR,
  "block_name" VARCHAR
);

CREATE TABLE "pages_blocks_content_columns" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "pages_blocks_content"("id") ON DELETE CASCADE,
  "size" VARCHAR DEFAULT 'oneThird',
  "rich_text" JSONB,
  "enable_link" BOOLEAN,
  "link_type" VARCHAR DEFAULT 'reference',
  "link_new_tab" BOOLEAN,
  "link_url" VARCHAR,
  "link_label" VARCHAR,
  "link_appearance" VARCHAR DEFAULT 'default'
);

CREATE TABLE "pages_blocks_media_block" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" VARCHAR,
  "media_id" UUID,
  "block_name" VARCHAR
);

CREATE TABLE "pages_blocks_archive" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" VARCHAR,
  "intro_content" JSONB,
  "populate_by" VARCHAR DEFAULT 'collection',
  "relation_to" VARCHAR DEFAULT 'posts',
  "limit" INTEGER DEFAULT 10,
  "block_name" VARCHAR
);

CREATE TABLE "pages_blocks_form_block" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" VARCHAR,
  "form_id" UUID,
  "enable_intro" BOOLEAN,
  "intro_content" JSONB,
  "block_name" VARCHAR
);

-- Create CTA links table
CREATE TABLE "pages_blocks_cta_links" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "_order" INTEGER,
  "_parent_id" UUID REFERENCES "pages_blocks_cta"("id") ON DELETE CASCADE,
  "link_type" VARCHAR DEFAULT 'reference',
  "link_new_tab" BOOLEAN,
  "link_url" VARCHAR,
  "link_label" VARCHAR,
  "link_appearance" VARCHAR DEFAULT 'default'
);

-- Create relation tables for pages
CREATE TABLE "pages_rels" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order" INTEGER,
  "parent_id" UUID REFERENCES "pages"("id") ON DELETE CASCADE,
  "path" VARCHAR,
  "pages_id" UUID,
  "posts_id" UUID,
  "media_id" UUID,
  "categories_id" UUID
);

-- Insert default header and footer with specific UUIDs
INSERT INTO "header" ("id") VALUES ('00000000-0000-0000-0000-000000000001');
INSERT INTO "footer" ("id") VALUES ('00000000-0000-0000-0000-000000000002');

-- Create indexes for better performance
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "pages_slug_idx" ON "pages"("slug");
CREATE INDEX "posts_slug_idx" ON "posts"("slug");
CREATE INDEX "pages_status_idx" ON "pages"("_status");
CREATE INDEX "posts_status_idx" ON "posts"("_status");
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
    console.log('🔧 Running UUID-based database migration...')
    
    const client = await pool.connect()
    
    try {
      // Run the migration SQL
      await client.query(createTablesSQL)
      console.log('✅ Database migration completed successfully')
      
      // Check if users exist
      const result = await client.query('SELECT COUNT(*) FROM users')
      const userCount = parseInt(result.rows[0].count)
      
      return NextResponse.json({
        success: true,
        message: 'Database migration completed successfully with UUID support',
        userCount,
        nextStep: userCount === 0 
          ? 'Go to /admin to create your first user'
          : 'Database is ready, go to /admin to log in'
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
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
