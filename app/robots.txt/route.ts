import { siteConfig } from "@/config/site"

export async function GET() {
  const robotsTxt = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

# Host
Host: ${siteConfig.url}

# Sitemaps
Sitemap: ${siteConfig.url}/sitemap.xml
`

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

