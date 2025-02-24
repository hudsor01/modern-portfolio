import { getPosts } from "@/lib/blog/api"
import { getProjects } from "@/lib/projects/actions"
import { siteConfig } from "@/config/site"

export async function GET(): Promise<Response> {
  const posts = await getPosts()
  const { projects } = await getProjects()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${siteConfig.url}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${siteConfig.url}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      ${posts
        .map(
          (post) => `
        <url>
          <loc>${siteConfig.url}/blog/${post.slug}</loc>
          <lastmod>${post.updatedAt.toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `,
        )
        .join("")}
      ${projects
        .map(
          (project) => `
        <url>
          <loc>${siteConfig.url}/projects/${project.slug}</loc>
          <lastmod>${project.updatedAt.toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>
      `,
        )
        .join("")}
    </urlset>`

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

