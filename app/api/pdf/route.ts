import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Set max duration for serverless function
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds

export async function GET() {
  try {
    // Get the site URL from environment or default to localhost
    const siteUrl = process.env.SITE_URL || 'https://richardwhudsonjr.com';
    const resumePath = '/resume?print=true';
    const fullUrl = `${siteUrl}${resumePath}`;

    // Log the URL we're trying to access
    console.log(`Generating PDF from: ${fullUrl}`);

    // Configure Puppeteer for serverless environment
    const executablePath = process.env.CHROME_EXECUTABLE_PATH || undefined;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    // Create a new page
    const page = await browser.newPage();

    // Navigate to the resume page with print mode
    await page.goto(fullUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000, // 30 seconds timeout
    });

    // Wait for content to load fully
    await page.waitForSelector('.resume-container', { timeout: 10000 });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
    });

    // Close browser
    await browser.close();

    // Return the PDF
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="richard-hudson-resume.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);

    return NextResponse.json(
      { error: 'Failed to generate PDF', details: (error as Error).message },
      { status: 500 }
    );
  }
}
