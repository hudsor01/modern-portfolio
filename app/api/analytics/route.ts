import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { path, type = "page_view", metadata = {} } = body

    // Insert the analytics event
    await sql`
      INSERT INTO analytics_events (
        event_type,
        path,
        metadata
      ) VALUES (
        ${type},
        ${path},
        ${JSON.stringify(metadata)}
      )
    `

    // If it's a page view, update the page_views table
    if (type === "page_view") {
      await sql`
        INSERT INTO page_views (path, views)
        VALUES (${path}, 1)
        ON CONFLICT (path, date)
        DO UPDATE SET views = page_views.views + 1
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to track analytics" }, { status: 500 })
  }
}

