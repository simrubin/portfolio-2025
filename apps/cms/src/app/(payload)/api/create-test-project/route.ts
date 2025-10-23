import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await createTestProject()
}

export async function POST() {
  return await createTestProject()
}

async function createTestProject() {
  try {
    console.log('🔄 Creating test project to initialize schema...')

    const payload = await getPayload({ config })

    // Create a simple test project
    const testProject = await payload.create({
      collection: 'projects',
      data: {
        title: 'Test Project',
        slug: 'test-project',
        publishedAt: new Date().toISOString(),
        year: 2025,
        newlyAdded: true,
        _status: 'published',
        heroImage: null, // Make heroImage optional for test
      } as any, // Use any to bypass TypeScript strict checking for test
    })

    console.log('✅ Test project created:', testProject.id)

    // Now delete it
    await payload.delete({
      collection: 'projects',
      id: testProject.id,
    })

    console.log('✅ Test project deleted')

    return NextResponse.json({
      success: true,
      message: 'Schema initialized successfully',
      testProjectId: testProject.id,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error creating test project:', error.message)
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
