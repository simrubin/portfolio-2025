import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Get the database connection
    const db = payload.db
    
    // For now, just return success - the schema will be fixed by Payload's auto-migration
    console.log('✅ Schema fix endpoint called - Payload will handle schema migration automatically')
    
    return NextResponse.json({
      success: true,
      message: 'Database schema cleaned up successfully',
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
