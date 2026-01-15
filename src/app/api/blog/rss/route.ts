import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, RSSFeedData } from '@/types/api'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import { createErrorResponse } from '@/lib/api-blog'

const logger = createContextLogger('RssAPI')

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://richardwhudsonjr.com'
const SITE_TITLE = 'Richard Hudson - Revenue Operations Blog'
const SITE_DESCRIPTION =
  'Expert insights on revenue operations, data analytics, and business process optimization from Richard Hudson, a seasoned RevOps professional.'

/**
 * Blog RSS Feed API Route Handler
 * GET /api/blog/rss - Generate RSS feed for blog posts
 *
 * Uses Prisma database for production data
 */

// GET /api/blog/rss - Generate RSS feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)

    // Fetch published posts from database
    const posts = await db.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: {
        author: true,
        category: true,
      },
    })

    const rssData: RSSFeedData = {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      link: `${SITE_URL}/blog`,
      lastBuildDate: new Date().toISOString(),
      language: 'en-us',
      posts: posts.map((post) => ({
        title: post.title,
        link: `${SITE_URL}/blog/${post.slug}`,
        description: post.excerpt || post.metaDescription || '',
        pubDate: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
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
          'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        },
      })
    }

    const response: ApiResponse<RSSFeedData> = {
      data: rssData,
      success: true,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      },
    })
  } catch (error) {
    logger.error(
      'Blog RSS API Error:',
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(createErrorResponse('Failed to generate RSS feed'), {
      status: 500,
    })
  }
}

function generateXmlFeed(data: RSSFeedData): string {
  const year = new Date().getFullYear()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${data.title}]]></title>
    <description><![CDATA[${data.description}]]></description>
    <link>${data.link}</link>
    <language>${data.language}</language>
    <lastBuildDate>${data.lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/blog/rss?format=xml" rel="self" type="application/rss+xml"/>
    <generator>Richard Hudson Portfolio Blog</generator>
    <webMaster>contact@richardwhudsonjr.com (Richard Hudson)</webMaster>
    <managingEditor>contact@richardwhudsonjr.com (Richard Hudson)</managingEditor>
    <copyright>© ${year} Richard Hudson</copyright>
    <category>Revenue Operations</category>
    <category>Data Analytics</category>
    <category>Business Intelligence</category>
    ${data.posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.link}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.pubDate).toUTCString()}</pubDate>
      <author>contact@richardwhudsonjr.com (${post.author})</author>
      <category><![CDATA[${post.category}]]></category>
      <guid isPermaLink="true">${post.guid}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`
}
