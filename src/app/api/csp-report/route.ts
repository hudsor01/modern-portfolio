import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parse the CSP report payload
    const cspReport = await request.json()

    // Log the CSP report - in production, you might want to send this to a monitoring service
    console.log('CSP Violation:', cspReport)

    // Return a success response
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing CSP report:', error)
    return NextResponse.json({ error: 'Failed to process CSP report' }, { status: 500 })
  }
}

// Define allowed HTTP methods
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
