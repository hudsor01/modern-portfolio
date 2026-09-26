import 'server-only'
import { NextResponse } from 'next/server'
import { and, eq, isNull, lte } from 'drizzle-orm'
import { db } from '@/lib/db'
import { blogPosts } from '@/db/schema'
import { env } from '@/lib/env-validation'
import { timingSafeEqualString } from '@/lib/timing-safe-equal'
import { createContextLogger } from '@/lib/logger'

const logger = createContextLogger('CronPublishScheduled')

/**
 * Publish blog posts whose scheduled time has arrived.
 *
 * `PostStatus` has had a `SCHEDULED` member since the Prisma era, `blogPosts`
 * has a `scheduledAt` column, the seed stages a SCHEDULED post, and `/blog` +
 * `/blog/[slug]` both correctly hide anything that is not PUBLISHED — but
 * nothing ever moved a post from SCHEDULED to PUBLISHED. Scheduling a post
 * meant it disappeared forever. This closes that.
 *
 * SCHEDULE: daily at 06:00 UTC, and that is a plan constraint, not a
 * preference. This project's Vercel team is on Hobby, where cron jobs are
 * "limited to cron jobs that run once per day" and "expressions like
 * `0 * * * *` (per-hour) ... will fail deployment"
 * (https://vercel.com/docs/cron-jobs/usage-and-pricing). An hourly schedule was
 * tried first and did exactly that — it broke two production deployments before
 * a single build was even created, because the rejection happens at config
 * validation.
 *
 * Consequence to be aware of when scheduling a post: Hobby precision is
 * "Per-hour (±59 min)", so this runs somewhere in the 06:00–06:59 UTC window.
 * A post therefore goes live up to ~25 hours after its `scheduledAt`. Set
 * `scheduledAt` to the day you want it live, not a precise minute. Upgrading to
 * Pro would allow a per-minute schedule.
 *
 * Auth is the Vercel Cron contract: when a `CRON_SECRET` environment variable
 * is set, Vercel sends `Authorization: Bearer <CRON_SECRET>` on the invocation
 * (https://vercel.com/docs/cron-jobs/manage-cron-jobs). Vercel's own example
 * compares with `!==`; this uses the repo's constant-time helper instead, in
 * line with how ADMIN_API_TOKEN and METRICS_API_TOKEN are checked.
 *
 * Fails closed: with no CRON_SECRET configured the route 401s rather than
 * running unauthenticated. The endpoint is a public URL — an open version would
 * let anyone force-publish scheduled drafts ahead of their embargo.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const cronSecret = env.CRON_SECRET
  const header = request.headers.get('authorization') ?? ''
  const provided = header.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() ?? ''

  if (!cronSecret || !timingSafeEqualString(provided, cronSecret)) {
    // Deliberately terse and identical for "not configured" and "wrong token" —
    // a distinguishable response would confirm whether the secret is set.
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // `lte(scheduledAt, now)` — due, not merely scheduled. `isNull(deletedAt)`
    // so a soft-deleted post cannot resurrect itself by reaching its date.
    const published = await db
      .update(blogPosts)
      .set({ status: 'PUBLISHED', publishedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(blogPosts.status, 'SCHEDULED'),
          isNull(blogPosts.deletedAt),
          lte(blogPosts.scheduledAt, new Date())
        )
      )
      .returning({ id: blogPosts.id, slug: blogPosts.slug })

    if (published.length > 0) {
      logger.info('Published scheduled posts', {
        count: published.length,
        slugs: published.map((p) => p.slug),
      })
    }

    return NextResponse.json(
      { published: published.length, slugs: published.map((p) => p.slug) },
      // Never cache: a cached 200 would make later runs no-ops at the edge.
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    logger.error(
      'Failed to publish scheduled posts',
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
