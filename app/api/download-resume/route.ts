import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    // Assuming your resume PDF is stored in the public folder
    const filePath = path.join(process.cwd(), "public", "resume.pdf")
    const fileBuffer = await fs.readFile(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=richard-hudson-resume.pdf",
      },
    })
  } catch (error) {
    console.error("Error downloading resume:", error)
    return NextResponse.json({ error: "Failed to download resume" }, { status: 500 })
  }
}

