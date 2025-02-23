"use server"

import { sql } from "@vercel/postgres"
import { cache } from "react"

export const getAnalyticsData = cache(async () => {
  try {
    // Get views per day for the last 30 days
    const { rows: dailyStats } = await sql`
      SELECT 
        date,
        SUM(views) as views,
        COUNT(DISTINCT session_id) as visitors
      FROM page_views
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY date
      ORDER BY date DESC
    `

    // Get top pages
    const { rows: topPages } = await sql`
      SELECT 
        path,
        SUM(views) as views,
        COUNT(DISTINCT session_id) as unique_views
      FROM page_views
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY path
      ORDER BY SUM(views) DESC
      LIMIT 5
    `

    // Get recent events
    const { rows: recentEvents } = await sql`
      SELECT 
        id,
        event_type,
        path,
        created_at,
        metadata
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get total stats
    const {
      rows: [totals],
    } = await sql`
      SELECT 
        SUM(views) as total_views,
        COUNT(DISTINCT session_id) as total_visitors,
        COUNT(DISTINCT path) as total_pages
      FROM page_views
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
    `

    return {
      dailyStats: dailyStats.map((stat) => ({
        date: stat.date.toISOString().split("T")[0],
        views: Number(stat.views),
        visitors: Number(stat.visitors),
      })),
      topPages: topPages.map((page) => ({
        path: page.path,
        views: Number(page.views),
        unique_views: Number(page.unique_views),
      })),
      recentEvents,
      totals: {
        total_views: Number(totals?.total_views || 0),
        total_visitors: Number(totals?.total_visitors || 0),
        total_pages: Number(totals?.total_pages || 0),
      },
    }
  } catch (error) {
    console.error("Failed to get analytics data:", error)
    return {
      dailyStats: [],
      topPages: [],
      recentEvents: [],
      totals: {
        total_views: 0,
        total_visitors: 0,
        total_pages: 0,
      },
    }
  }
})

