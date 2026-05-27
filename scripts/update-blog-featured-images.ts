/**
 * One-off: sync the prod DB's blog featuredImage/featuredImageAlt columns
 * to the canonical mapping in `src/data/blog-featured-images.ts`.
 *
 * Why it exists: production was holding ~9 Unsplash hotlinks shared across
 * 27 posts. One was a literal "UNDER CONSTRUCTION" laptop mockup; two
 * were dated COVID-19 dashboards; one was a recruiting dashboard
 * mislabeled as a sales pipeline. The canonical mapping replaces those
 * with unique, visually-verified, topical photos.
 *
 * Idempotent: running again just re-asserts the same values. Safe to
 * keep around — re-run whenever the mapping in
 * `src/data/blog-featured-images.ts` changes.
 *
 * Usage: `bun run scripts/update-blog-featured-images.ts`
 */
import { and, inArray, isNull, sql } from 'drizzle-orm'
import { blogPosts } from '@/db/schema'
import { BLOG_FEATURED_IMAGES } from '../src/data/blog-featured-images'
import { unsplashUrl } from '../src/lib/unsplash'
import { createScriptDb } from './_db'

const db = createScriptDb({ blogPosts })

async function main() {
  // Collapse all 27 updates into a single statement: one round-trip to
  // Neon instead of 27, and atomic — no half-applied state if the HTTP
  // connection drops mid-loop. Per-slug CASE branches drive the two
  // updated columns; updatedAt bumps for every matched row.
  // seedOnly entries (DRAFT/SCHEDULED posts not yet in prod) live in the
  // canonical mapping for seed consistency but aren't expected to match
  // any prod row — exclude them before building the UPDATE.
  const entries = BLOG_FEATURED_IMAGES.filter((e) => !e.seedOnly)
  if (entries.length === 0) {
    // sql.join over an empty array would emit `CASE  END` — a Postgres
    // syntax error before the UPDATE even runs. Bail cleanly instead.
    console.log('No non-seedOnly entries in canonical mapping; nothing to do.')
    return 0
  }
  const slugs = entries.map((e) => e.slug)
  const imageCase = sql.join(
    entries.map(
      (e) => sql`WHEN ${blogPosts.slug} = ${e.slug} THEN ${unsplashUrl(e.photoId, 'blog')}`
    ),
    sql.raw(' ')
  )
  const altCase = sql.join(
    entries.map((e) => sql`WHEN ${blogPosts.slug} = ${e.slug} THEN ${e.alt}`),
    sql.raw(' ')
  )

  // isNull(deletedAt): a soft-deleted row that happens to share a slug
  // (legacy data from the Prisma era) should not get re-armed.
  const result = await db
    .update(blogPosts)
    .set({
      featuredImage: sql`CASE ${imageCase} END`,
      featuredImageAlt: sql`CASE ${altCase} END`,
      // updatedAt has no $onUpdate hook — bump it explicitly so the
      // sitemap <lastmod> moves and Search Console schedules a recrawl.
      // Same reason scripts/touch-blog-lastmod.ts exists.
      updatedAt: sql`NOW()`,
    })
    .where(and(inArray(blogPosts.slug, slugs), isNull(blogPosts.deletedAt)))
    .returning({ slug: blogPosts.slug })

  const updatedSlugs = new Set(result.map((r) => r.slug))
  for (const entry of entries) {
    if (updatedSlugs.has(entry.slug)) {
      console.log(`  ✓ ${entry.slug}`)
    } else {
      console.warn(`  ⚠ skipped (slug not found or soft-deleted): ${entry.slug}`)
    }
  }
  const skipped = entries.length - updatedSlugs.size
  console.log(`\nUpdated ${updatedSlugs.size} blog posts (${skipped} not found).`)
  return skipped
}

main()
  // Exit nonzero on any miss — otherwise a typo or schema drift hides
  // behind a clean exit and the operator declares success.
  .then((skipped) => process.exit(skipped > 0 ? 1 : 0))
  .catch((err) => {
    console.error('update-blog-featured-images failed:', err)
    process.exit(1)
  })
