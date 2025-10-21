#!/usr/bin/env node

/**
 * Initialize database schema before build
 * This ensures all tables exist before Next.js tries to generate static pages
 */

import { getPayload } from 'payload'
import config from '@payload-config'

async function initDatabase() {
  console.log('🔧 Initializing database schema...')
  
  try {
    const payload = await getPayload({ config })
    
    // Simply getting payload instance will initialize the database
    console.log('✅ Database initialized successfully')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    process.exit(1)
  }
}

initDatabase()
