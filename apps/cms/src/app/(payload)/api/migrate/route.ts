import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const createTablesSQL = `
-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS "users_sessions" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "expires_at" TIMESTAMP WITH TIME ZONE
);

-- Create pages table
CREATE TABLE IF NOT EXISTS "pages" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR,
  "hero_type" VARCHAR DEFAULT 'none',
  "hero_rich_text" JSONB,
  "hero_media_id" INTEGER,
  "meta_title" VARCHAR,
  "meta_image_id" INTEGER,
  "meta_description" TEXT,
  "published_at" TIMESTAMP WITH TIME ZONE,
  "generate_slug" BOOLEAN DEFAULT true,
  "slug" VARCHAR,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "_status" VARCHAR DEFAULT 'draft'
);

-- Create pages_hero_links table
CREATE TABLE IF NOT EXISTS "pages_hero_links" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "pages"("id") ON DELETE CASCADE,
  "link_type" VARCHAR DEFAULT 'reference',
  "link_new_tab" BOOLEAN,
  "link_url" VARCHAR,
  "link_label" VARCHAR,
  "link_appearance" VARCHAR DEFAULT 'default'
);

-- Create posts table
CREATE TABLE IF NOT EXISTS "posts" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR,
  "content" JSONB,
  "meta_title" VARCHAR,
  "meta_description" TEXT,
  "meta_image_id" INTEGER,
  "published_at" TIMESTAMP WITH TIME ZONE,
  "slug" VARCHAR,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "_status" VARCHAR DEFAULT 'draft'
);

-- Create media table
CREATE TABLE IF NOT EXISTS "media" (
  "id" SERIAL PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS "projects" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR,
  "description" TEXT,
  "image_id" INTEGER,
  "tech_stack" JSONB,
  "github_url" VARCHAR,
  "live_url" VARCHAR,
  "featured" BOOLEAN DEFAULT false,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "_status" VARCHAR DEFAULT 'draft'
);

-- Create header table
CREATE TABLE IF NOT EXISTS "header" (
  "id" SERIAL PRIMARY KEY,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create header_nav_items table
CREATE TABLE IF NOT EXISTS "header_nav_items" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "header"("id") ON DELETE CASCADE,
  "link_type" VARCHAR DEFAULT 'reference',
  "link_new_tab" BOOLEAN,
  "link_url" VARCHAR,
  "link_label" VARCHAR
);

-- Create footer table
CREATE TABLE IF NOT EXISTS "footer" (
  "id" SERIAL PRIMARY KEY,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create footer_nav_items table
CREATE TABLE IF NOT EXISTS "footer_nav_items" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "footer"("id") ON DELETE CASCADE,
  "link_type" VARCHAR DEFAULT 'reference',
  "link_new_tab" BOOLEAN,
  "link_url" VARCHAR,
  "link_label" VARCHAR
);

-- Create redirects table
CREATE TABLE IF NOT EXISTS "redirects" (
  "id" SERIAL PRIMARY KEY,
  "from" VARCHAR,
  "to_type" VARCHAR DEFAULT 'reference',
  "to_url" VARCHAR,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relation tables
CREATE TABLE IF NOT EXISTS "header_rels" (
  "id" SERIAL PRIMARY KEY,
  "order" INTEGER,
  "parent_id" INTEGER REFERENCES "header"("id") ON DELETE CASCADE,
  "path" VARCHAR,
  "pages_id" INTEGER,
  "posts_id" INTEGER
);

CREATE TABLE IF NOT EXISTS "footer_rels" (
  "id" SERIAL PRIMARY KEY,
  "order" INTEGER,
  "parent_id" INTEGER REFERENCES "footer"("id") ON DELETE CASCADE,
  "path" VARCHAR,
  "pages_id" INTEGER,
  "posts_id" INTEGER
);

CREATE TABLE IF NOT EXISTS "redirects_rels" (
  "id" SERIAL PRIMARY KEY,
  "order" INTEGER,
  "parent_id" INTEGER REFERENCES "redirects"("id") ON DELETE CASCADE,
  "path" VARCHAR,
  "pages_id" INTEGER,
  "posts_id" INTEGER
);

-- Create block tables for pages
CREATE TABLE IF NOT EXISTS "pages_blocks_cta" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" VARCHAR,
  "rich_text" JSONB,
  "block_name" VARCHAR
);

CREATE TABLE IF NOT EXISTS "pages_blocks_content" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" VARCHAR,
  "block_name" VARCHAR
);

CREATE TABLE IF NOT EXISTS "pages_blocks_content_columns" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "pages_blocks_content"("id") ON DELETE CASCADE,
  "size" VARCHAR DEFAULT 'oneThird',
  "rich_text" JSONB,
  "enable_link" BOOLEAN,
  "link_type" VARCHAR DEFAULT 'reference',
  "link_new_tab" BOOLEAN,
  "link_url" VARCHAR,
  "link_label" VARCHAR,
  "link_appearance" VARCHAR DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS "pages_blocks_media_block" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" VARCHAR,
  "media_id" INTEGER,
  "block_name" VARCHAR
);

CREATE TABLE IF NOT EXISTS "pages_blocks_archive" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" VARCHAR,
  "intro_content" JSONB,
  "populate_by" VARCHAR DEFAULT 'collection',
  "relation_to" VARCHAR DEFAULT 'posts',
  "limit" INTEGER DEFAULT 10,
  "block_name" VARCHAR
);

CREATE TABLE IF NOT EXISTS "pages_blocks_form_block" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "pages"("id") ON DELETE CASCADE,
  "_path" VARCHAR,
  "form_id" INTEGER,
  "enable_intro" BOOLEAN,
  "intro_content" JSONB,
  "block_name" VARCHAR
);

-- Create CTA links table
CREATE TABLE IF NOT EXISTS "pages_blocks_cta_links" (
  "id" SERIAL PRIMARY KEY,
  "_order" INTEGER,
  "_parent_id" INTEGER REFERENCES "pages_blocks_cta"("id") ON DELETE CASCADE,
  "link_type" VARCHAR DEFAULT 'reference',
  "link_new_tab" BOOLEAN,
  "link_url" VARCHAR,
  "link_label" VARCHAR,
  "link_appearance" VARCHAR DEFAULT 'default'
);

-- Create relation tables for pages
CREATE TABLE IF NOT EXISTS "pages_rels" (
  "id" SERIAL PRIMARY KEY,
  "order" INTEGER,
  "parent_id" INTEGER REFERENCES "pages"("id") ON DELETE CASCADE,
  "path" VARCHAR,
  "pages_id" INTEGER,
  "posts_id" INTEGER,
  "media_id" INTEGER,
  "categories_id" INTEGER
);

-- Insert default header and footer if they don't exist
INSERT INTO "header" ("id") VALUES (1) ON CONFLICT DO NOTHING;
INSERT INTO "footer" ("id") VALUES (1) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages"("slug");
CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts"("slug");
CREATE INDEX IF NOT EXISTS "pages_status_idx" ON "pages"("_status");
CREATE INDEX IF NOT EXISTS "posts_status_idx" ON "posts"("_status");
`

export async function GET() {
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json(
      { success: false, error: 'POSTGRES_URL environment variable is not set' },
      { status: 500 }
    )
  }

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })

  try {
    console.log('🔧 Running database migration...')
    
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
        message: 'Database migration completed successfully',
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
      { status: 500 }
    )
  } finally {
    await pool.end()
  }
}
