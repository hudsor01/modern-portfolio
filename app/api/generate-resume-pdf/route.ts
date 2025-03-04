import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function GET() {
	try {
		// Launch a headless browser
		const browser = await puppeteer.launch({ headless: true })
		const page = await browser.newPage()

		// Navigate to the resume page (using absolute URL for production)
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
		await page.goto(`${baseUrl}/resume?print=true`, {
			waitUntil: 'networkidle2',
		})

		// Wait for any content to load
		await page.waitForSelector('h1', { timeout: 5000 })

		// Add print styles
		await page.addStyleTag({
			content: `
        @page {
          margin: 20mm;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
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

		// Generate PDF
		const pdf = await page.pdf({
			format: 'A4',
			printBackground: true,
			margin: {
				top: '20mm',
				right: '20mm',
				bottom: '20mm',
				left: '20mm',
			},
		})

		await browser.close()

		// Return PDF as response
		return new NextResponse(pdf, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename="richard-hudson-resume.pdf"',
			},
		})
	} catch (error) {
		console.error('Error generating PDF:', error)
		return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
	}
}
