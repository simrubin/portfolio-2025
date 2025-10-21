import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    console.log('🔧 Creating Payload schema...')
    
    const config = await configPromise
    
    // Initialize Payload - this should trigger schema creation
    const payload = await getPayload({ 
      config,
      disableOnInit: false,
    })
    
    console.log('✅ Payload instance created')
    
    // Try to access the database adapter directly to force initialization
    if (payload.db) {
      console.log('🔧 Accessing database adapter...')
      
      // Try to create a simple user to force schema creation
      try {
        console.log('🔧 Attempting to create schema by creating a test user...')
        
        const testUser = await payload.create({
          collection: 'users',
          data: {
            email: 'test@example.com',
            password: 'testpassword123',
            name: 'Test User',
          },
        })
        
        console.log('✅ Test user created, schema exists')
        
        // Delete the test user
        await payload.delete({
          collection: 'users',
          id: testUser.id,
        })
        
        console.log('✅ Test user deleted')
        
        return NextResponse.json({
          success: true,
          message: 'Schema created successfully',
          nextStep: 'Go to /admin to create your first user'
        })
        
      } catch (createError) {
        console.log('⚠️ Could not create test user, but this might be expected')
        console.log('Error:', createError)
        
        // Even if user creation fails, the schema might have been created
        return NextResponse.json({
          success: true,
          message: 'Schema initialization attempted',
          warning: 'User creation failed but schema may exist',
          nextStep: 'Try going to /admin to create your first user'
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payload initialized',
      nextStep: 'Go to /admin to create your first user'
    })
    
  } catch (error) {
    console.error('❌ Schema creation failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
