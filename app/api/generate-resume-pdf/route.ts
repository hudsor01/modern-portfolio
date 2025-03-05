import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { errorResponse } from '@/lib/api/response'
import { headers } from 'next/headers'

// Configure allowed origins for CORS
const allowedOrigins = [process.env.NEXT_PUBLIC_BASE_URL, 'http://localhost:3000']

// Custom error class for PDF generation
class PDFGenerationError extends Error {
	readonly statusCode: number

	constructor(message: string, statusCode: number = 500) {
		super(message)
		this.name = 'PDFGenerationError'
		this.statusCode = statusCode
	}
}

export async function GET() {
	let browser
	try {
		// CORS validation
		const headersList = await headers()
		const origin = headersList.get('origin')

		if (origin && !allowedOrigins.includes(origin)) {
			return errorResponse('Unauthorized origin', 403)
		}

		// Launch browser with production-optimized configuration
		browser = await puppeteer
			.launch({
				headless: true,
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-dev-shm-usage',
					'--disable-gpu',
					'--font-render-hinting=none',
				],
				// @ts-ignore - TypeScript definitions might be missing this property
				ignoreHTTPSErrors: true,
				timeout: 30000,
			})
			.catch(error => {
				throw new PDFGenerationError('Failed to launch browser: ' + error.message)
			})

		const page = await browser.newPage()

		// Set viewport for consistent rendering
		await page.setViewport({ width: 1200, height: 1600 })

		// Set default timeout for all operations
		page.setDefaultTimeout(10000)

		// Navigate to the resume page with proper error handling
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
		await page
			.goto(`${baseUrl}/resume?print=true`, {
				waitUntil: 'networkidle2',
				timeout: 10000,
			})
			.catch(error => {
				throw new PDFGenerationError('Failed to load resume page: ' + error.message)
			})

		// Wait for content with proper timeout
		await page.waitForSelector('h1', { timeout: 5000 }).catch(() => {
			throw new PDFGenerationError('Timeout waiting for content')
		})

		// Add print styles with error handling
		await page
			.addStyleTag({
				content: `
			@page {
				margin: 20mm;
				size: A4;
			}
			body {
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
				color-adjust: exact;
				margin: 0;
				padding: 0;
			}
			.hide-for-print {
				display: none !important;
			}
			@media print {
				body {
					background: white;
				}
			}
		`,
			})
			.catch(error => {
				throw new PDFGenerationError('Failed to add print styles: ' + error.message)
			})

		// Generate PDF with optimized settings
		const pdf = await page
			.pdf({
				format: 'A4',
				printBackground: true,
				margin: {
					top: '20mm',
					right: '20mm',
					bottom: '20mm',
					left: '20mm',
				},
				preferCSSPageSize: true,
				scale: 1,
				pageRanges: '1-',
			})
			.catch(error => {
				throw new PDFGenerationError('Failed to generate PDF: ' + error.message)
			})

		// Return PDF with security headers
		return new NextResponse(pdf, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename="richard-hudson-resume.pdf"',
				'Access-Control-Allow-Origin': origin || '*',
				'Access-Control-Allow-Methods': 'GET',
				'Cache-Control': 'no-store, max-age=0',
				'X-Content-Type-Options': 'nosniff',
				'X-Frame-Options': 'DENY',
				'Content-Security-Policy': "default-src 'self'",
			},
		})
	} catch (error) {
		console.error('PDF Generation Error:', error)

		// Handle known errors
		if (error instanceof PDFGenerationError) {
			return errorResponse(error.message, error.statusCode)
		}

		// Handle unknown errors
		return errorResponse('An unexpected error occurred while generating the PDF', 500)
	} finally {
		// Ensure browser is always closed
		if (browser) {
			await browser.close().catch(console.error)
		}
	}
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: Request) {
	const origin = request.headers.get('origin')

	if (origin && !allowedOrigins.includes(origin)) {
		return new NextResponse(null, { status: 403 })
	}

	return new NextResponse(null, {
		headers: {
			'Access-Control-Allow-Origin': origin || '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Max-Age': '86400',
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
		},
	})
}
