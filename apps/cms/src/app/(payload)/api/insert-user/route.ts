import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json(
      { success: false, error: 'POSTGRES_URL environment variable is not set' },
      { status: 500 },
    )
  }

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })

  try {
    const client = await pool.connect()

    try {
      // Check if any users exist
      const existingUsers = await client.query('SELECT COUNT(*) FROM users')
      const userCount = parseInt(existingUsers.rows[0].count)

      if (userCount > 0) {
        return NextResponse.json({
          success: true,
          message: 'Users already exist',
          count: userCount,
        })
      }

      // Create a simple user with a pre-hashed password (admin123)
      // This is the hash for "admin123" with salt
      const result = await client.query(`
        INSERT INTO users (id, email, name, hash, salt, created_at, updated_at) 
        VALUES (
          uuid_generate_v4(), 
          'admin@example.com', 
          'Admin User',
          '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          NOW(), 
          NOW()
        ) 
        RETURNING id, email, name
      `)

      const user = result.rows[0]

      console.log('✅ User created successfully:', user.email)

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        credentials: {
          email: 'admin@example.com',
          password: 'admin123',
        },
        nextStep: 'You can now log in to the admin panel',
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Failed to create user:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  } finally {
    await pool.end()
  }
}
