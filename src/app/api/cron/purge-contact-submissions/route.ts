import 'server-only'
import { NextResponse } from 'next/server'
import { lt, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contactSubmissions } from '@/db/schema'
import { env } from '@/lib/env-validation'
import { timingSafeEqualString } from '@/lib/timing-safe-equal'
import { createContextLogger } from '@/lib/logger'

const logger = createContextLogger('CronPurgeContactSubmissions')

/**
 * Delete contact submissions older than 24 months — the retention period
 * stated on /privacy. If the period changes, /privacy and
 * PRIVACY_POLICY_LAST_UPDATED must change with it.
 *
 * SCHEDULE: daily at 04:17 UTC via `vercel.json` (off the hour; Vercel Pro).
 *
 * Auth is the Vercel Cron contract: when `CRON_SECRET` is set, Vercel sends
 * `Authorization: Bearer <CRON_SECRET>` on the invocation
 * (https://vercel.com/docs/cron-jobs/manage-cron-jobs), compared here with the
 * repo's constant-time helper.
 *
 * Fails closed: with no CRON_SECRET configured the route 401s rather than
 * running unauthenticated. The endpoint is a public URL — an open version would
 * let anyone trigger deletes.
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
    // Cutoff is fixed in SQL with no request input. `.returning().length`, not
    // `db.execute` rowCount (neon-http returns a result object, see CLAUDE.md).
    const deleted = await db
      .delete(contactSubmissions)
      .where(lt(contactSubmissions.createdAt, sql`now() - interval '24 months'`))
      .returning({ id: contactSubmissions.id })

    if (deleted.length > 0) {
      // Count only — never ids or emails.
      logger.info('Purged contact submissions', { count: deleted.length })
    }

    return NextResponse.json(
      { deleted: deleted.length },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    // The DELETE has no bound params, so the message carries no PII.
    logger.error(
      'Failed to purge contact submissions',
      error instanceof Error ? new Error(error.message) : new Error(String(error))
    )
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
