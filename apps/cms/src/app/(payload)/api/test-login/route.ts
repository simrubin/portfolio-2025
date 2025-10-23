import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return await testLogin()
}

export async function POST() {
  return await testLogin()
}

async function testLogin() {
  try {
    const payload = await getPayload({ config })
    
    console.log('🔄 Testing login with simrubin13@gmail.com...')
    
    // Try to find the user
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'simrubin13@gmail.com',
        },
      },
    })
    
    if (users.docs.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        availableUsers: [],
      })
    }
    
    const user = users.docs[0]
    
    // Try to authenticate using Payload's built-in method
    try {
      const authResult = await payload.login({
        collection: 'users',
        data: {
          email: 'simrubin13@gmail.com',
          password: 'admin123',
        },
      })
      
      return NextResponse.json({
        success: true,
        message: 'Login successful!',
        user: {
          id: authResult.user.id,
          email: authResult.user.email,
          name: authResult.user.name,
        },
        token: authResult.token ? 'Present' : 'Not present',
      })
      
    } catch (loginError: any) {
      return NextResponse.json({
        success: false,
        message: 'Login failed',
        loginError: loginError.message,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          hasPassword: !!user.password,
          passwordLength: user.password ? user.password.length : 0,
        },
      })
    }
    
  } catch (error: any) {
    console.error('❌ Error testing login:', error.message)
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
