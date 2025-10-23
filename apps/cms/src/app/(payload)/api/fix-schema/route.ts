import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function POST() {
  const POSTGRES_URL = process.env.POSTGRES_URL

  if (!POSTGRES_URL) {
    return NextResponse.json({ success: false, error: 'POSTGRES_URL is not set' }, { status: 500 })
  }

  const pgPool = new Pool({ connectionString: POSTGRES_URL })

  try {
    const client = await pgPool.connect()
    try {
      await client.query('BEGIN')

      // Create missing relationship tables that the build logs showed were missing
      const relationshipTables = [
        // Pages relationship tables
        `CREATE TABLE IF NOT EXISTS pages_hero_links (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          _parent_id UUID NOT NULL,
          _order INTEGER NOT NULL,
          link_type VARCHAR,
          link_new_tab BOOLEAN DEFAULT false,
          link_url VARCHAR,
          link_label VARCHAR,
          link_appearance VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        `CREATE TABLE IF NOT EXISTS pages_blocks_cta (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          _parent_id UUID NOT NULL,
          _order INTEGER NOT NULL,
          _path VARCHAR,
          rich_text JSONB,
          block_name VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        `CREATE TABLE IF NOT EXISTS pages_blocks_cta_links (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          _parent_id UUID NOT NULL,
          _order INTEGER NOT NULL,
          link_type VARCHAR,
          link_new_tab BOOLEAN DEFAULT false,
          link_url VARCHAR,
          link_label VARCHAR,
          link_appearance VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        `CREATE TABLE IF NOT EXISTS pages_blocks_content (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          _parent_id UUID NOT NULL,
          _order INTEGER NOT NULL,
          _path VARCHAR,
          block_name VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        `CREATE TABLE IF NOT EXISTS pages_blocks_content_columns (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          _parent_id UUID NOT NULL,
          _order INTEGER NOT NULL,
          size VARCHAR,
          rich_text JSONB,
          enable_link BOOLEAN DEFAULT false,
          link_type VARCHAR,
          link_new_tab BOOLEAN DEFAULT false,
          link_url VARCHAR,
          link_label VARCHAR,
          link_appearance VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        `CREATE TABLE IF NOT EXISTS pages_blocks_mediaBlock (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          _parent_id UUID NOT NULL,
          _order INTEGER NOT NULL,
          _path VARCHAR,
          media_id UUID,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        `CREATE TABLE IF NOT EXISTS pages_blocks_archive (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          _parent_id UUID NOT NULL,
          _order INTEGER NOT NULL,
          _path VARCHAR,
          block_name VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        `CREATE TABLE IF NOT EXISTS pages_blocks_formBlock (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          _parent_id UUID NOT NULL,
          _order INTEGER NOT NULL,
          _path VARCHAR,
          block_name VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        `CREATE TABLE IF NOT EXISTS pages_rels (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          parent_id UUID NOT NULL,
          "order" INTEGER NOT NULL,
          path VARCHAR,
          pages_id UUID,
          posts_id UUID,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        // Header relationship tables
        `CREATE TABLE IF NOT EXISTS header_nav_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          _parent_id UUID NOT NULL,
          _order INTEGER NOT NULL,
          link_type VARCHAR,
          link_new_tab BOOLEAN DEFAULT false,
          link_url VARCHAR,
          link_label VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        `CREATE TABLE IF NOT EXISTS header_rels (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          parent_id UUID NOT NULL,
          "order" INTEGER NOT NULL,
          path VARCHAR,
          pages_id UUID,
          posts_id UUID,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        // Footer relationship tables
        `CREATE TABLE IF NOT EXISTS footer_nav_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          _parent_id UUID NOT NULL,
          _order INTEGER NOT NULL,
          link_type VARCHAR,
          link_new_tab BOOLEAN DEFAULT false,
          link_url VARCHAR,
          link_label VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        `CREATE TABLE IF NOT EXISTS footer_rels (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          parent_id UUID NOT NULL,
          "order" INTEGER NOT NULL,
          path VARCHAR,
          pages_id UUID,
          posts_id UUID,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        // Posts relationship tables
        `CREATE TABLE IF NOT EXISTS posts_rels (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          parent_id UUID NOT NULL,
          "order" INTEGER NOT NULL,
          path VARCHAR,
          posts_id UUID,
          categories_id UUID,
          users_id UUID,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,

        // Redirects relationship tables
        `CREATE TABLE IF NOT EXISTS redirects_rels (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          parent_id UUID NOT NULL,
          "order" INTEGER NOT NULL,
          path VARCHAR,
          pages_id UUID,
          posts_id UUID,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,
      ]

      // Create all relationship tables
      for (const tableSQL of relationshipTables) {
        await client.query(tableSQL)
      }

      // Create indexes for better performance
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_pages_hero_links_parent_id ON pages_hero_links(_parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_pages_blocks_cta_parent_id ON pages_blocks_cta(_parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_pages_blocks_cta_links_parent_id ON pages_blocks_cta_links(_parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_pages_blocks_content_parent_id ON pages_blocks_content(_parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_pages_blocks_content_columns_parent_id ON pages_blocks_content_columns(_parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_pages_blocks_mediaBlock_parent_id ON pages_blocks_mediaBlock(_parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_pages_blocks_archive_parent_id ON pages_blocks_archive(_parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_pages_blocks_formBlock_parent_id ON pages_blocks_formBlock(_parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_pages_rels_parent_id ON pages_rels(parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_header_nav_items_parent_id ON header_nav_items(_parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_header_rels_parent_id ON header_rels(parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_footer_nav_items_parent_id ON footer_nav_items(_parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_footer_rels_parent_id ON footer_rels(parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_posts_rels_parent_id ON posts_rels(parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_redirects_rels_parent_id ON redirects_rels(parent_id)',
      ]

      for (const indexSQL of indexes) {
        await client.query(indexSQL)
      }

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: 'All relationship tables created successfully',
        tablesCreated: relationshipTables.length,
        indexesCreated: indexes.length,
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('Error creating relationship tables:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    await pgPool.end()
  }
}

