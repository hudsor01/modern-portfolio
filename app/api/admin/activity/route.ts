import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { requireAdmin } from "@/lib/actions/auth"

export async function GET() {
  try {
    await requireAdmin()

    const { rows } = await sql`
      WITH combined_activity AS (
        -- Posts activity
        SELECT 
          id,
          'post' as type,
          title,
          created_at as timestamp
        FROM posts
        WHERE created_at >= NOW() - INTERVAL '7 days'
        
        UNION ALL
        
        -- Projects activity
        SELECT 
          id,
          'project' as type,
          title,
          created_at as timestamp
        FROM projects
        WHERE created_at >= NOW() - INTERVAL '7 days'
        
        UNION ALL
        
        -- Page views
        SELECT 
          id,
          'view' as type,
          page_path as title,
          created_at as timestamp
        FROM analytics
        WHERE created_at >= NOW() - INTERVAL '7 days'
        
        UNION ALL
        
        -- Contact submissions
        SELECT 
          id,
          'contact' as type,
          email as title,
          created_at as timestamp
        FROM contact_submissions
        WHERE created_at >= NOW() - INTERVAL '7 days'
      )
      SELECT *
      FROM combined_activity
      ORDER BY timestamp DESC
      LIMIT 10
    `

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}

