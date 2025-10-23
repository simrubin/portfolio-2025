import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return await testCors(request)
}

export async function POST(request: Request) {
  return await testCors(request)
}

async function testCors(request: Request) {
  try {
    console.log('🔄 Testing CORS configuration...')
    
    // Get request headers
    const headers = Object.fromEntries(request.headers.entries())
    const origin = headers.origin || headers.referer || 'unknown'
    
    console.log('Request origin:', origin)
    console.log('Request headers:', {
      'user-agent': headers['user-agent'],
      'accept': headers['accept'],
      'origin': headers.origin,
      'referer': headers.referer,
    })
    
    // Test if this is a CORS preflight request
    const isPreflight = request.method === 'OPTIONS'
    
    if (isPreflight) {
      console.log('🔄 Handling CORS preflight request')
      
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
        },
      })
    }
    
    // Return CORS headers for actual request
    const response = NextResponse.json({
      success: true,
      message: 'CORS test successful',
      origin: origin,
      method: request.method,
      timestamp: new Date().toISOString(),
    })
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    
    return response
    
  } catch (error: any) {
    console.error('❌ Error testing CORS:', error.message)
    
    const response = NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
    
    // Add CORS headers even for errors
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    
    return response
  }
}
