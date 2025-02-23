import { sql } from "@vercel/postgres"
import RSS from "rss"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://richardwhudsonjr.com"

  const feed = new RSS({
    title: "Richard Hudson's Blog",
    description: "Thoughts and insights on software development, revenue operations, and technology solutions",
    site_url: baseUrl,
    feed_url: `${baseUrl}/feed.xml`,
    language: "en",
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Richard Hudson`,
  })

  const { rows: posts } = await sql`
    SELECT 
      title, 
      excerpt, 
      slug, 
      published_at,
      content
    FROM posts 
    WHERE status = 'published' 
    ORDER BY published_at DESC
    LIMIT 10
  `

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      date: post.published_at,
      guid: post.slug,
      custom_elements: [{ "content:encoded": post.content }],
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}

