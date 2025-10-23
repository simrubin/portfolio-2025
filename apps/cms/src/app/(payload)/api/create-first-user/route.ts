import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
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
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 },
      )
    }

    const client = await pool.connect()

    try {
      // Check if any users exist
      const existingUsers = await client.query('SELECT COUNT(*) FROM users')
      const userCount = parseInt(existingUsers.rows[0].count)

      if (userCount > 0) {
        return NextResponse.json(
          { success: false, error: 'Users already exist. Use the admin panel to log in.' },
          { status: 400 },
        )
      }

      // Generate salt and hash password
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      // Create first user
      const result = await client.query(
        `INSERT INTO users (id, email, name, hash, salt, created_at, updated_at) 
         VALUES (uuid_generate_v4(), $1, $2, $3, $4, NOW(), NOW()) 
         RETURNING id, email, name`,
        [email, name, hash, salt]
      )

      const user = result.rows[0]

      console.log('✅ First user created successfully:', user.email)

      return NextResponse.json({
        success: true,
        message: 'First user created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        nextStep: 'You can now log in to the admin panel',
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Failed to create first user:', error)
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
