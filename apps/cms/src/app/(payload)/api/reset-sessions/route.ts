import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST() {
  try {
    const payload = await getPayload({ config })
    
    // Get the user
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    if (users.docs.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No users found'
      })
    }
    
    const user = users.docs[0]
    
    // Clear all sessions by updating the user
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        sessions: []
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'All user sessions cleared. Please log in again.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
