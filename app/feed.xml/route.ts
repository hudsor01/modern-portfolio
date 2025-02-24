import { getPosts } from "@/lib/blog/api"
import { siteConfig } from "@/config/site"

export async function GET() {
  const posts = await getPosts()

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${siteConfig.name}</title>
        <link>${siteConfig.url}</link>
        <description>${siteConfig.description}</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
        ${posts
          .map(
            (post) => `
          <item>
            <title>${post.title}</title>
            <link>${siteConfig.url}/blog/${post.slug}</link>
            <description>${post.description}</description>
            <pubDate>${new Date(post.publishedAt || post.updatedAt).toUTCString()}</pubDate>
            <guid>${siteConfig.url}/blog/${post.slug}</guid>
            <author>${siteConfig.author.email} (${siteConfig.author.name})</author>
            ${post.tags.map((tag) => `<category>${tag}</category>`).join("")}
          </item>
        `,
          )
          .join("")}
      </channel>
    </rss>`

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

