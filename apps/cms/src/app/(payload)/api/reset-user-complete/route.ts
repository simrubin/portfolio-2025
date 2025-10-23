import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import bcrypt from 'bcryptjs'

export async function GET() {
  return await resetUserComplete()
}

export async function POST() {
  return await resetUserComplete()
}

async function resetUserComplete() {
  try {
    const payload = await getPayload({ config })
    
    console.log('🔄 Performing complete user reset...')
    
    // Hash the new password
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Find the user by email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'simrubin13@gmail.com',
        },
      },
    })
    
    if (users.docs.length === 0) {
      console.log('❌ User not found. Creating new user...')
      
      // Create a new user
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: 'simrubin13@gmail.com',
          password: hashedPassword,
          name: 'Admin User',
        },
      })
      
      console.log('✅ New user created successfully!')
      
      return NextResponse.json({
        success: true,
        message: 'New user created successfully',
        email: 'simrubin13@gmail.com',
        password: 'admin123',
        userId: newUser.id,
      })
    }
    
    // Update the existing user - reset password and unlock
    const user = users.docs[0]
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: hashedPassword,
        // Reset any lock fields
        loginAttempts: 0,
        lockUntil: null,
      },
    })
    
    console.log('✅ User reset successfully!')
    
    return NextResponse.json({
      success: true,
      message: 'User reset successfully - password updated and account unlocked',
      email: 'simrubin13@gmail.com',
      password: 'admin123',
      userId: user.id,
    })
    
  } catch (error: any) {
    console.error('❌ Error resetting user:', error.message)
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
