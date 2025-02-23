import { NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { sql } from "@vercel/postgres"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get media item
    const {
      rows: [media],
    } = await sql`
      SELECT * FROM media WHERE id = ${params.id}
    `

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Delete from Vercel Blob
    await del(media.url)

    // Delete from database
    await sql`DELETE FROM media WHERE id = ${params.id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}

