import { type NextRequest, NextResponse } from 'next/server'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { blogPosts } from '@/db/schema'
import { createContextLogger } from '@/lib/logger'
import { checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-rate-limit'
import { getClientIdentifier, getClientUserAgent } from '@/lib/api-request'
import { slugSchema } from '@/lib/schemas'

const logger = createContextLogger('BlogViewAPI')

/**
 * POST /api/blog/[slug]/view — counts one read of a published post.
 *
 * Why this exists: blog_posts.view_count was only ever incremented by
 * GET /api/blog/[slug]. When the post page switched to querying the database
 * directly (Jan 2026, cd6dba5c) nothing on a real page view incremented it any
 * more, so every post's count froze. The post page now sends this beacon once
 * per view (ViewBeacon).
 *
 * It only adds 1 to a PUBLISHED, non-deleted post's counter and stores nothing
 * else (no IP, no user agent). Abuse is bounded three ways: the `read` rate
 * limit, a per-client-per-post 30-minute dedupe, and a bot user-agent filter.
 * There is no CSRF token: the endpoint changes no user-visible state beyond an
 * anonymous counter and a sendBeacon cannot carry the double-submit header.
 * The response is 204 either way, so callers cannot probe which slugs exist.
 */

const DEDUPE_MS = 30 * 60 * 1000
const DEDUPE_MAX = 10_000
const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly/i

// Best-effort per-instance dedupe (serverless instances do not share it).
const recent = new Map<string, number>()

export function isDuplicateView(key: string, now = Date.now()): boolean {
  const last = recent.get(key)
  if (last !== undefined && now - last < DEDUPE_MS) return true
  if (recent.size >= DEDUPE_MAX) {
    for (const [k, t] of recent) if (now - t >= DEDUPE_MS) recent.delete(k)
    if (recent.size >= DEDUPE_MAX) recent.clear()
  }
  recent.set(key, now)
  return false
}

export function resetViewDedupe(): void {
  recent.clear()
}

const noContent = () =>
  new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const limited = checkRateLimitOrRespond(
    request,
    RateLimitPresets.read,
    '/api/blog/[slug]/view',
    'POST'
  )
  if (limited) return limited

  const parsed = slugSchema.safeParse((await context.params).slug)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  const slug = parsed.data

  if (BOT_UA.test(getClientUserAgent(request.headers) ?? '')) return noContent()
  if (isDuplicateView(`${getClientIdentifier(request)}:${slug}`)) return noContent()

  try {
    await db
      .update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(
        and(
          eq(blogPosts.slug, slug),
          eq(blogPosts.status, 'PUBLISHED'),
          isNull(blogPosts.deletedAt)
        )
      )
  } catch (error) {
    logger.error(
      'Failed to record blog view',
      error instanceof Error ? error : new Error(String(error)),
      { slug }
    )
  }
  return noContent()
}
