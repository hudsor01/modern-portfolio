import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const maxDuration = 5 // 5 seconds max execution time

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		// Log Web Vitals data
		console.log('Web Vitals:', body)

		// Here, you could store the data in a database,
		// forward to an analytics service, etc.

		return NextResponse.json({ success: true }, { status: 202 })
	} catch (error) {
		console.error('Error processing web vitals:', error)
		return NextResponse.json({ error: 'Failed to process web vitals data' }, { status: 500 })
	}
}
