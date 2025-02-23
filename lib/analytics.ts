import { sql } from "@vercel/postgres"

export async function getAnalytics() {
  // Get total views for the past 30 days
  const {
    rows: [viewsData],
  } = await sql`
    SELECT SUM(views) as total
    FROM analytics
    WHERE date >= CURRENT_DATE - INTERVAL '30 days'
  `

  // Get total posts
  const {
    rows: [postsData],
  } = await sql`
    SELECT COUNT(*) as total
    FROM posts
    WHERE status = 'published'
  `

  // Get resume downloads
  const {
    rows: [downloadsData],
  } = await sql`
    SELECT SUM(views) as total
    FROM analytics
    WHERE event_type = 'resume_download'
    AND date >= CURRENT_DATE - INTERVAL '30 days'
  `

  // Get views over time
  const { rows: viewsOverTime } = await sql`
    SELECT date, SUM(views) as views
    FROM analytics
    WHERE date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY date
    ORDER BY date
  `

  // Get top pages
  const { rows: topPages } = await sql`
    SELECT page_path, SUM(views) as views
    FROM analytics
    WHERE date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT 5
  `

  return {
    totalViews: viewsData.total || 0,
    totalPosts: postsData.total || 0,
    resumeDownloads: downloadsData.total || 0,
    viewsOverTime,
    topPages,
  }
}

export async function trackPageView(path: string) {
  await sql`
    INSERT INTO analytics (page_path, views)
    VALUES (${path}, 1)
    ON CONFLICT (page_path, date)
    DO UPDATE SET views = analytics.views + 1
  `
}

export async function getRecentActivity(limit = 10) {
  const { rows } = await sql`
    SELECT 
      id,
      type,
      description,
      created_at as timestamp
    FROM activity_log
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
  return rows
}

export async function trackActivity(type: string, description: string) {
  await sql`
    INSERT INTO activity_log (type, description)
    VALUES (${type}, ${description})
  `
}

