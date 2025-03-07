import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the web vitals data
    const webVitalsData = await request.json();

    // Log the web vitals data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals API:', webVitalsData);
    }

    // In production, you might want to send this to an analytics service

    // Return a success response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing web vitals data:', error);
    return NextResponse.json({ error: 'Failed to process web vitals data' }, { status: 500 });
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
  });
}
