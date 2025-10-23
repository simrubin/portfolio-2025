import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    console.log('🔄 Force clearing all caches...')
    
    // Clear admin interface cache
    revalidatePath('/admin')
    revalidatePath('/admin/collections/projects')
    revalidatePath('/admin/collections/media')
    
    // Clear API caches
    revalidatePath('/api/projects')
    revalidatePath('/api/media')
    
    return NextResponse.json({
      success: true,
      message: 'All caches cleared successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Error clearing caches:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
