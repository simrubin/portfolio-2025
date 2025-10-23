import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await createUserPayload()
}

export async function POST() {
  return await createUserPayload()
}

async function createUserPayload() {
  try {
    const payload = await getPayload({ config })
    
    console.log('🔄 Creating user using Payload\'s built-in method...')
    
    // First, try to delete existing user
    try {
      const existingUsers = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: 'simrubin13@gmail.com',
          },
        },
      })
      
      if (existingUsers.docs.length > 0) {
        console.log('🗑️ Deleting existing user...')
        await payload.delete({
          collection: 'users',
          id: existingUsers.docs[0].id,
        })
      }
    } catch (deleteError) {
      console.log('ℹ️ No existing user to delete or delete failed:', deleteError)
    }
    
    // Create new user using Payload's built-in method
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email: 'simrubin13@gmail.com',
        password: 'admin123',
        name: 'Admin User',
      },
    })
    
    console.log('✅ User created successfully using Payload method!')
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully using Payload\'s built-in method',
      email: 'simrubin13@gmail.com',
      password: 'admin123',
      userId: newUser.id,
      userData: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
      },
    })
    
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
