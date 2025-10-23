import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET() {
  try {
    const payload = await getPayload({ config });
    
    // Test basic database connection
    const projectsCount = await payload.count({
      collection: 'projects',
    });
    
    const mediaCount = await payload.count({
      collection: 'media',
    });
    
    // Test if we can create a simple query
    const testProject = await payload.find({
      collection: 'projects',
      limit: 1,
    });
    
    return NextResponse.json({
      success: true,
      database: {
        projectsCount,
        mediaCount,
        canQuery: testProject.docs.length > 0,
        hasData: testProject.docs.length > 0,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasPayloadSecret: !!process.env.PAYLOAD_SECRET,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
