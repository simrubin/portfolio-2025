const { Pool } = require('pg')

// Database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
})

async function resetPassword() {
  try {
    console.log('🔄 Resetting password for simrubin13@gmail.com...')
    
    // Hash the new password (using bcrypt)
    const bcrypt = require('bcryptjs')
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Update the user password
    const result = await pool.query(
      'UPDATE payload_users SET password = $1 WHERE email = $2',
      [hashedPassword, 'simrubin13@gmail.com']
    )
    
    if (result.rowCount > 0) {
      console.log('✅ Password reset successfully!')
      console.log('📧 Email: simrubin13@gmail.com')
      console.log('🔑 Password: admin123')
    } else {
      console.log('❌ User not found. Let me check what users exist...')
      
      // Check existing users
      const users = await pool.query('SELECT id, email, created_at FROM payload_users')
      console.log('📋 Existing users:')
      users.rows.forEach(user => {
        console.log(`  - ID: ${user.id}, Email: ${user.email}, Created: ${user.created_at}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error resetting password:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await pool.end()
  }
}

resetPassword()
