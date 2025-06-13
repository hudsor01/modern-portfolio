import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { error: 'PDF generation temporarily disabled - puppeteer dependency not installed' },
    { status: 503 }
  )
}