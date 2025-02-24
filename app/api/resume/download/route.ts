import { NextResponse } from "next/server"
import puppeteer from "puppeteer"
import { sql } from "@vercel/postgres"
import { ResumeGenerationError, ResumeErrorCodes } from "@/lib/exceptions/resume-errors"

export async function GET() {
  try {
    // Track the download
    try {
      await sql`
        INSERT INTO analytics (page_path, views, event_type)
        VALUES ('/resume/download', 1, 'resume_download')
        ON CONFLICT (page_path, date)
        DO UPDATE SET views = analytics.views + 1
      `
    } catch (error) {
      console.error("Failed to track resume download:", error)
      // Continue with download even if tracking fails
    }

    // Launch Puppeteer with retry mechanism
    let browser
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })
    } catch (error) {
      throw new ResumeGenerationError("Failed to initialize PDF generation", ResumeErrorCodes.BROWSER_ERROR, error)
    }

    try {
      const page = await browser.newPage()

      // Set viewport to match A4 size at 96 DPI
      await page.setViewport({
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      })

      // Navigate with timeout and error handling
      const response = await page.goto(`${process.env.NEXT_PUBLIC_APP_URL}/resume/view`, {
        waitUntil: "networkidle0",
        timeout: 30000, // 30 second timeout
      })

      if (!response?.ok()) {
        throw new ResumeGenerationError("Failed to load resume content", ResumeErrorCodes.NAVIGATION_ERROR, {
          status: response?.status(),
        })
      }

      // Generate PDF with exact A4 formatting
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "0.75in",
          right: "0.75in",
          bottom: "0.75in",
          left: "0.75in",
        },
        preferCSSPageSize: true,
      })

      await browser.close()

      // Return the PDF with appropriate headers
      return new NextResponse(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="richard-hudson-resume.pdf"',
          "Cache-Control": "no-cache",
        },
      })
    } catch (error) {
      if (browser) {
        await browser.close()
      }
      throw new ResumeGenerationError("Failed to generate resume PDF", ResumeErrorCodes.RENDER_ERROR, error)
    }
  } catch (error) {
    console.error("Resume generation error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof ResumeGenerationError
            ? {
                message: error.message,
                code: error.code,
                details: process.env.NODE_ENV === "development" ? error.details : undefined,
              }
            : {
                message: "An unexpected error occurred",
                code: ResumeErrorCodes.UNKNOWN_ERROR,
              },
      },
      { status: 500 },
    )
  }
}

