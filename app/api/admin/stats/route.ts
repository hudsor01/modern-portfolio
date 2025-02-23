import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { requireAdmin } from "@/lib/actions/auth"

export async function GET() {
  try {
    await requireAdmin()

    // Get current stats
    const currentStats = await sql`
      SELECT 
        SUM(views) as total_views,
        COUNT(DISTINCT session_id) as unique_visitors,
        COUNT(DISTINCT CASE WHEN event_type = 'conversion' THEN session_id END) as conversions
      FROM analytics
      WHERE date >= NOW() - INTERVAL '30 days'
    `

    // Get previous period stats for comparison
    const previousStats = await sql`
      SELECT 
        SUM(views) as total_views,
        COUNT(DISTINCT session_id) as unique_visitors,
        COUNT(DISTINCT CASE WHEN event_type = 'conversion' THEN session_id END) as conversions
      FROM analytics
      WHERE date >= NOW() - INTERVAL '60 days'
      AND date < NOW() - INTERVAL '30 days'
    `

    // Get post counts
    const {
      rows: [postCounts],
    } = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent
      FROM posts
    `

    // Calculate changes
    const current = currentStats.rows[0]
    const previous = previousStats.rows[0]

    const calculateChange = (current: number, previous: number) => {
      if (!previous) return 0
      return ((current - previous) / previous) * 100
    }

    const stats = {
      views: current.total_views,
      viewsChange: calculateChange(current.total_views, previous.total_views),
      visitors: current.unique_visitors,
      visitorsChange: calculateChange(current.unique_visitors, previous.unique_visitors),
      posts: postCounts.total,
      postsChange: (postCounts.recent / postCounts.total) * 100,
      conversionRate: (current.conversions / current.unique_visitors) * 100,
      conversionRateChange: calculateChange(
        current.conversions / current.unique_visitors,
        previous.conversions / previous.unique_visitors,
      ),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

