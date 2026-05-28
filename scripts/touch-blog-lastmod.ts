/**
 * One-off: bump updatedAt on every PUBLISHED, non-deleted blog post.
 *
 * Why: from PR #97 onward we discovered jsdom (transitively pulled in by
 * isomorphic-dompurify) had been failing to resolve at Turbopack runtime
 * since the Next.js 16 migration — every /blog/[slug] silently rendered
 * the soft-404 fallback. Google Search Console bucketed that across the
 * blog as "Crawled - currently not indexed". The code fix (bdf52f4)
 * landed the real 200 response; this touch refreshes <lastmod> in
 * sitemap.xml so Google sees "content modified" on next sitemap fetch and
 * re-crawls with the working response.
 *
 * Idempotent: run again later and it just bumps updatedAt to "now" again.
 * Safe to remove after the GSC validation closes.
 *
 * Usage: `bun run scripts/touch-blog-lastmod.ts`
 */
import { and, eq, isNull, sql } from 'drizzle-orm'
import { blogPosts } from '@/db/schema'
import { createScriptDb } from './_db'

const db = createScriptDb({ blogPosts })

async function main() {
  const result = await db
    .update(blogPosts)
    .set({ updatedAt: sql`NOW()` })
    .where(and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt)))
    .returning({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })

  console.log(`Touched ${result.length} published blog posts:`)
  for (const row of result) {
    console.log(`  ${row.slug} → ${row.updatedAt?.toISOString()}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('touch-blog-lastmod failed:', err)
    process.exit(1)
  })
