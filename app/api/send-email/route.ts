import { NextResponse } from 'next/server';
import { sendContactEmail } from './action';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await sendContactEmail(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in send-email API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
