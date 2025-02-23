import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT
        id,
        title,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM posts
      ORDER BY created_at DESC
    `
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
