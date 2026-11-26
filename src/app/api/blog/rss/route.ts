import { type NextRequest, NextResponse } from 'next/server'
import { and, desc, eq, isNull } from 'drizzle-orm'
import type { ApiResponse, RSSFeedData } from '@/types/api'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import { blogPosts } from '@/db/schema'
import { createErrorResponse } from '@/lib/api-blog'
import { SITE_ORIGIN } from '@/lib/absolute-url'
import { CONTACT } from '@/lib/contact-info'
import { getDisplayYearMonth } from '@/lib/data-formatters'
import { BLOG_CONTENT_HEAD_EXTRAS } from '@/lib/blog-content-head'
import { resolvePostLede } from '@/lib/blog-excerpt'

const logger = createContextLogger('RssAPI')

// RSS feed URL pins to prod (via SITE_ORIGIN) — preview deploys must
// not advertise themselves as the syndication source because feed
// readers cache <link> by URL and a one-time preview hit would poison
// subscribers' caches for that post slug.
const SITE_URL = SITE_ORIGIN
const SITE_TITLE = 'Richard Hudson - Revenue Operations Blog'
const SITE_DESCRIPTION =
  'Expert insights on revenue operations, data analytics, and business process optimization from Richard Hudson, a seasoned RevOps professional.'

/**
 * Blog RSS Feed API Route Handler
 * GET /api/blog/rss - the autodiscovery target. The bare URL and any
 * unrecognised ?format= serve RSS 2.0 XML (the XML default); ?format=json
 * serves the ApiResponse<RSSFeedData> JSON contract.
 */

const CACHE_CONTROL = 'public, max-age=3600, s-maxage=7200'

/** Clamp ?limit= into 1..100; anything that is not an integer falls back to 50. */
function parseLimit(raw: string | null): number {
  if (raw !== null && /^-?\d+$/.test(raw)) {
    return Math.min(Math.max(Number(raw), 1), 100)
  }
  return 50
}

/**
 * Escape a value for an XML text node or attribute. Strips characters that
 * are illegal in XML 1.0 first, then escapes the five markup characters
 * (ampersand first). The feed uses only unwrapped, escaped text nodes, so no
 * input sequence can terminate or break out of anything.
 */
function isLegalXmlChar(code: number): boolean {
  if (code < 0x20) return code === 0x09 || code === 0x0a || code === 0x0d
  return code !== 0xfffe && code !== 0xffff
}

function escapeXml(value: string): string {
  let legal = ''
  for (const char of value) {
    if (isLegalXmlChar(char.codePointAt(0) ?? 0)) legal += char
  }
  return legal
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// GET /api/blog/rss - Generate RSS feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') === 'json' ? 'json' : 'xml'
    const limit = parseLimit(searchParams.get('limit'))

    const posts = await db.query.blogPosts.findMany({
      // Same public gate as /blog, the sitemap and GET /api/blog: soft-deleted
      // posts (retired duplicates whose URLs 308) must not stay in the feed.
      where: and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt)),
      orderBy: desc(blogPosts.publishedAt),
      limit,
      // Only what the feed renders. Never the body or the search index: a full
      // row is ~37 KB per post, so 25 posts made each feed fetch ~0.9 MB of
      // database transfer. The description is derived from a bounded
      // 4000-char contentHead extra, never the whole body.
      columns: {
        title: true,
        slug: true,
        excerpt: true,
        metaDescription: true,
        publishedAt: true,
        createdAt: true,
      },
      extras: BLOG_CONTENT_HEAD_EXTRAS,
      with: {
        author: { columns: { name: true } },
        category: { columns: { name: true } },
      },
    })

    const itemDate = (post: (typeof posts)[number]) => post.publishedAt ?? post.createdAt
    const lastBuild = posts.length
      ? new Date(Math.max(...posts.map((post) => itemDate(post).getTime())))
      : new Date()

    const rssData: RSSFeedData = {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      link: `${SITE_URL}/blog`,
      lastBuildDate: lastBuild.toISOString(),
      language: 'en-us',
      posts: posts.map((post) => ({
        title: post.title,
        link: `${SITE_URL}/blog/${post.slug}`,
        // Equal to the post-page lede: same resolver, LEDE_MAX and 4000-code-point
        // body prefix (contentHead), so no bio boilerplate reaches a feed reader.
        description: resolvePostLede({
          excerpt: post.excerpt,
          content: post.contentHead,
          metaDescription: post.metaDescription,
        }),
        pubDate: itemDate(post).toISOString(),
        author: post.author?.name || 'Richard Hudson',
        category: post.category?.name || 'Revenue Operations',
        guid: `${SITE_URL}/blog/${post.slug}`,
      })),
    }

    if (format === 'xml') {
      const xmlFeed = generateXmlFeed(rssData)
      return new NextResponse(xmlFeed, {
        status: 200,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': CACHE_CONTROL,
        },
      })
    }

    const response: ApiResponse<RSSFeedData> = {
      data: rssData,
      success: true,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': CACHE_CONTROL,
      },
    })
  } catch (error) {
    logger.error('Blog RSS API Error:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(createErrorResponse('Failed to generate RSS feed'), {
      status: 500,
    })
  }
}

function generateXmlFeed(data: RSSFeedData): string {
  const year = getDisplayYearMonth().year

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(data.title)}</title>
    <description>${escapeXml(data.description)}</description>
    <link>${escapeXml(data.link)}</link>
    <language>${escapeXml(data.language)}</language>
    <lastBuildDate>${new Date(data.lastBuildDate).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${SITE_URL}/api/blog/rss`)}" rel="self" type="application/rss+xml"/>
    <generator>Richard Hudson Portfolio Blog</generator>
    <webMaster>${CONTACT.email} (Richard Hudson)</webMaster>
    <managingEditor>${CONTACT.email} (Richard Hudson)</managingEditor>
    <copyright>${escapeXml(`© ${year} Richard Hudson`)}</copyright>
    <category>Revenue Operations</category>
    <category>Data Analytics</category>
    <category>Business Intelligence</category>
    ${data.posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.link)}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.pubDate).toUTCString()}</pubDate>
      <author>${escapeXml(`${CONTACT.email} (${post.author})`)}</author>
      <category>${escapeXml(post.category ?? '')}</category>
      <guid isPermaLink="true">${escapeXml(post.guid)}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`
}
