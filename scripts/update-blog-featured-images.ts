/**
 * One-off: sync the prod DB's blog featuredImage/featuredImageAlt
 * columns to the canonical mapping in
 * `src/data/blog-featured-images.ts`.
 *
 * Idempotent. Re-run after editing the canonical mapping.
 *
 * Usage: `bun run scripts/update-blog-featured-images.ts`
 */
import { and, eq, inArray, isNull, sql, type SQL } from 'drizzle-orm'
import { blogPosts } from '@/db/schema'
import { BLOG_FEATURED_IMAGES } from '../src/data/blog-featured-images'
import { unsplashUrl } from '../src/lib/unsplash'
import { createScriptDb } from './_db'

const db = createScriptDb({ blogPosts })

async function main() {
  // Skip seedOnly entries (DRAFT/SCHEDULED posts not yet in prod) so a
  // clean prod run still exits 0.
  const entries = BLOG_FEATURED_IMAGES.filter((e) => !e.seedOnly)
  if (entries.length === 0) {
    console.log('No non-seedOnly entries; nothing to do.')
    return 0
  }

  // Pre-flight swap detection. The partial unique index on
  // (featuredImage WHERE status='PUBLISHED' AND deletedAt IS NULL) is
  // not DEFERRABLE — Postgres rejects partial indexes from the
  // DEFERRABLE clause. So a single CASE UPDATE that swaps two
  // PUBLISHED rows' URLs (A wants B's current value, B wants A's
  // current value) would trip the per-row constraint check mid-statement.
  //
  // Scope: we query ALL PUBLISHED non-deleted rows (not just canonical
  // slugs) because the constraint spans the whole table. A row outside
  // the canonical mapping (legacy import, future blog post added via
  // POST /api/blog) that happens to hold a URL the script wants to
  // assign would otherwise pass pre-flight and then trigger 23505
  // mid-statement — exactly the opaque failure mode this check exists
  // to prevent.
  const allPublished = await db
    .select({ slug: blogPosts.slug, featuredImage: blogPosts.featuredImage })
    .from(blogPosts)
    .where(and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt)))
  const currentBySlug = new Map(allPublished.map((r) => [r.slug, r.featuredImage]))
  const currentlyUsed = new Set(
    allPublished.map((r) => r.featuredImage).filter((v): v is string => v !== null && v !== '')
  )
  const swapConflicts: string[] = []
  for (const entry of entries) {
    const target = unsplashUrl(entry.photoId, 'blog')
    if (currentBySlug.get(entry.slug) === target) continue // no change needed
    // Conflict if another row already holds this URL. Self-match (the
    // entry's own current value) is caught by the equality check above.
    if (currentlyUsed.has(target)) swapConflicts.push(entry.slug)
  }
  if (swapConflicts.length > 0) {
    console.error(
      'Swap detected — these slugs want a featuredImage value currently held by another PUBLISHED row:',
      swapConflicts
    )
    console.error(
      'The partial unique index is not DEFERRABLE (Postgres limitation on partial indexes).'
    )
    console.error(
      'Resolve by: (a) NULL out featuredImage for the affected slugs via psql, then re-run; or (b) split the canonical edit into two runs that don\'t swap.'
    )
    return swapConflicts.length
  }
  const slugs = entries.map((e) => e.slug)

  // Single atomic batched UPDATE — one round-trip instead of N. Matches
  // the official Drizzle "Update many with different values" recipe:
  // a `CASE WHEN slug = $1 THEN $value END` per column, joined by
  // `sql.join(chunks, sql.raw(' '))`.
  // https://orm.drizzle.team/docs/guides/update-many-with-different-value
  const buildCase = (valueFor: (e: (typeof entries)[number]) => string): SQL => {
    const chunks: SQL[] = [sql`(case`]
    for (const e of entries) {
      chunks.push(sql`when ${blogPosts.slug} = ${e.slug} then ${valueFor(e)}`)
    }
    chunks.push(sql`end)`)
    return sql.join(chunks, sql.raw(' '))
  }

  const result = await db
    .update(blogPosts)
    .set({
      featuredImage: buildCase((e) => unsplashUrl(e.photoId, 'blog')),
      featuredImageAlt: buildCase((e) => e.alt),
      // Drizzle has no $onUpdate on this column, so a bare .set() leaves
      // updatedAt stale — the sitemap's <lastmod> wouldn't move and
      // Search Console wouldn't recrawl, defeating the SEO point of
      // the swap. Same reason scripts/touch-blog-lastmod.ts exists.
      updatedAt: sql`NOW()`,
    })
    // isNull(deletedAt): don't re-arm soft-deleted rows that share a
    // legacy slug from the Prisma era.
    .where(and(inArray(blogPosts.slug, slugs), isNull(blogPosts.deletedAt)))
    .returning({ slug: blogPosts.slug })

  const updatedSlugs = new Set(result.map((r) => r.slug))
  for (const entry of entries) {
    console.log(
      updatedSlugs.has(entry.slug)
        ? `  ✓ ${entry.slug}`
        : `  ⚠ skipped (slug not found or soft-deleted): ${entry.slug}`
    )
  }
  const skipped = entries.length - updatedSlugs.size
  console.log(`\nUpdated ${updatedSlugs.size} blog posts (${skipped} not found).`)
  return skipped
}

main()
  // Exit nonzero on any miss so a typo or schema drift doesn't hide
  // behind a clean exit code in CI / shell &&.
  .then((skipped) => process.exit(skipped > 0 ? 1 : 0))
  .catch((err) => {
    console.error('update-blog-featured-images failed:', err)
    process.exit(1)
  })
