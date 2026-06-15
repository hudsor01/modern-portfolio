/**
 * One-off (idempotent): clean legacy truncated blog slugs.
 *
 * Several blog rows were created by a since-removed bulk import that hard-cut
 * slugs at 80 chars MID-WORD, leaving low-quality URLs like
 * `…the-one-framework-that-fixes-` (dangling hyphen) and `…with-vanity-metri`
 * (split word). These bypassed the validated POST /api/blog path (whose
 * generateSlug never truncates mid-word) and fail slugSchema's regex. They are
 * a quality signal Google can hold against an already-young domain.
 *
 * This renames each truncated slug to the clean, word-boundary slug derived
 * from the post's title (via the same generateSlug used at write time). It is
 * SAFE to run repeatedly: after a successful apply, the natural slug equals the
 * stored slug and nothing is flagged.
 *
 * No next.config redirects are added: these URLs are "Crawled - currently not
 * indexed" (zero ranking equity to preserve), so 404-ing the old slug is fine —
 * Google drops it and picks up the new slug from the sitemap. (Contrast the
 * de-cannibalization redirects, which preserved equity on URLs Google HAD
 * ranked.)
 *
 * Usage (local DATABASE_URL is stale — supply the current prod URL):
 *   DATABASE_URL="$(cat .env.dburl)" bun run scripts/clean-truncated-slugs.ts           # dry run
 *   DATABASE_URL="$(cat .env.dburl)" bun run scripts/clean-truncated-slugs.ts --apply   # write
 */
import { eq } from 'drizzle-orm'
import { blogPosts } from '../src/db/schema'
import { generateSlug } from '../src/lib/slug'
import { createScriptDb } from './_db'

async function main(): Promise<void> {
  const apply = process.argv.includes('--apply')

  // Resolve the connection string from DIRECT_URL (preferred — the non-pooled
  // endpoint, ideal for a one-off write) then DATABASE_URL. Both are loaded
  // from .env*/the environment; createScriptDb reads process.env.DATABASE_URL,
  // so we point it at whichever is set. The value is never read into a variable
  // here nor printed — it stays in the environment.
  if (process.env.DIRECT_URL) process.env.DATABASE_URL = process.env.DIRECT_URL
  const source = process.env.DIRECT_URL ? 'DIRECT_URL' : 'DATABASE_URL'
  console.log(`Using connection from ${source}.`)

  const db = createScriptDb({ blogPosts })

  const rows = await db
    .select({ id: blogPosts.id, slug: blogPosts.slug, title: blogPosts.title })
    .from(blogPosts)

  // Track live slugs so a regenerated slug can't collide with an existing one.
  const taken = new Set(rows.map((r) => r.slug))
  const renames: Array<{ id: string; from: string; to: string }> = []

  for (const row of rows) {
    const stripped = row.slug.replace(/-+$/, '')
    const natural = generateSlug(row.title)

    // A slug is "truncated" only when it is a strict prefix of the title's
    // natural slug (optionally with a dangling hyphen). This precisely targets
    // import artifacts and never touches intentionally-renamed slugs (e.g. the
    // de-cannibalization keepers), whose slug is a *different phrasing* of the
    // title, not a prefix of it.
    const isTruncated =
      natural !== row.slug && natural.startsWith(stripped) && natural.length > stripped.length
    if (!isTruncated) continue

    let candidate = natural
    let n = 2
    while (taken.has(candidate) && candidate !== row.slug) {
      candidate = `${natural}-${n++}`
    }
    taken.delete(row.slug)
    taken.add(candidate)
    renames.push({ id: row.id, from: row.slug, to: candidate })
  }

  if (renames.length === 0) {
    console.log('No truncated slugs found — nothing to do.')
    return
  }

  console.log(
    `${renames.length} truncated slug(s) ${apply ? 'to rename:' : '(dry run — pass --apply to write):'}`
  )
  for (const r of renames) {
    console.log(`  ${r.from}\n     -> ${r.to}`)
  }

  if (!apply) {
    console.log('\nDry run complete. Re-run with --apply to write.')
    return
  }

  for (const r of renames) {
    // updatedAt has no DB default on these Prisma-created tables — set it
    // explicitly or hit a NOT-NULL violation. The bump is honest: the URL
    // genuinely changed.
    await db
      .update(blogPosts)
      .set({ slug: r.to, updatedAt: new Date() })
      .where(eq(blogPosts.id, r.id))
    console.log(`renamed ${r.id}: ${r.to}`)
  }
  console.log(`\nDone — ${renames.length} slug(s) renamed.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
