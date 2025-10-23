import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    const payload = await getPayload({ config })
    
    console.log('🔄 Resetting password for simrubin13@gmail.com...')
    
    // Hash the new password
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Find the user by email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'simrubin13@gmail.com'
        }
      }
    })
    
    if (users.docs.length === 0) {
      console.log('❌ User not found. Available users:')
      const allUsers = await payload.find({
        collection: 'users',
        limit: 10
      })
      allUsers.docs.forEach(user => {
        console.log(`  - ID: ${user.id}, Email: ${user.email}`)
      })
      
      return NextResponse.json({
        success: false,
        message: 'User not found',
        availableUsers: allUsers.docs.map(u => ({ id: u.id, email: u.email }))
      })
    }
    
    // Update the user password
    const user = users.docs[0]
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: hashedPassword
      }
    })
    
    console.log('✅ Password reset successfully!')
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      email: 'simrubin13@gmail.com',
      password: 'admin123'
    })
    
  } catch (error: any) {
    console.error('❌ Error resetting password:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}
