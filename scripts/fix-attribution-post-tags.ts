/**
 * Fix #125 — re-tag the Multi-Touch Attribution post.
 *
 * The post under the "Marketing Attribution" category was tagged
 * A/B Testing / Forecasting / Dashboards — none describe its subject. This
 * relinks it to attribution-relevant tags (creating the two new ones if the
 * production DB doesn't have them yet), matching the corrected drizzle/seed.ts.
 *
 * Idempotent: running again is a no-op once the tags are correct.
 * Safe by default — prints the plan and changes nothing unless APPLY=1.
 *
 *   bun run scripts/fix-attribution-post-tags.ts          # dry run (preview)
 *   APPLY=1 bun run scripts/fix-attribution-post-tags.ts  # commit changes
 */
import { and, eq, inArray } from 'drizzle-orm'
import { blogPosts, postTags, tags } from '../src/db/schema'
import { createId } from '../src/db/cuid'
import { createScriptDb } from './_db'

const db = createScriptDb({ blogPosts, postTags, tags })

const POST_SLUG = 'multi-touch-attribution-modeling-best-practices'

// Desired final tag set. The two attribution tags are created if absent; `kpis`
// already exists in the catalog (covers the ROI/metrics angle).
const DESIRED_TAGS = [
  { name: 'Attribution Modeling', slug: 'attribution-modeling', description: 'Multi-touch and marketing attribution models', color: '#EC4899' },
  { name: 'Marketing Analytics', slug: 'marketing-analytics', description: 'Campaign measurement and marketing ROI analysis', color: '#0EA5E9' },
  { name: 'KPIs', slug: 'kpis', description: 'Key Performance Indicators and metrics', color: '#3B82F6' },
]

const APPLY = process.env.APPLY === '1'

async function main() {
  const post = (
    await db.select({ id: blogPosts.id, title: blogPosts.title }).from(blogPosts).where(eq(blogPosts.slug, POST_SLUG))
  )[0]
  if (!post) {
    throw new Error(`Post not found: ${POST_SLUG}`)
  }
  console.log(`Post: ${post.title} (${post.id})`)

  // Resolve / create each desired tag.
  const desiredIds: string[] = []
  for (const t of DESIRED_TAGS) {
    let row = (await db.select({ id: tags.id }).from(tags).where(eq(tags.slug, t.slug)))[0]
    if (!row) {
      console.log(`  tag "${t.slug}" missing — ${APPLY ? 'creating' : 'would create'}`)
      if (APPLY) {
        // The prod `tags` table was created by Prisma: `updatedAt` (@updatedAt)
        // has NO database default, so Drizzle's implicit DEFAULT violates the
        // NOT NULL constraint. Set both timestamps explicitly.
        const now = new Date()
        row = (
          await db
            .insert(tags)
            .values({
              id: createId(),
              name: t.name,
              slug: t.slug,
              description: t.description,
              color: t.color,
              createdAt: now,
              updatedAt: now,
            })
            .returning({ id: tags.id })
        )[0]
      }
    }
    if (row) desiredIds.push(row.id)
  }

  const current = await db
    .select({ tagId: postTags.tagId, slug: tags.slug })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, post.id))
  console.log(`  current tags: ${JSON.stringify(current.map((c) => c.slug))}`)

  const currentIds = new Set(current.map((c) => c.tagId))
  const desiredSet = new Set(desiredIds)
  const toAdd = desiredIds.filter((id) => !currentIds.has(id))
  const toRemove = [...currentIds].filter((id) => !desiredSet.has(id))

  console.log(`  desired tags: ${JSON.stringify(DESIRED_TAGS.map((t) => t.slug))}`)
  console.log(`  +add ${toAdd.length}  -remove ${toRemove.length}`)

  if (!APPLY) {
    console.log('\nDRY RUN — re-run with APPLY=1 to commit.')
    return
  }

  if (toRemove.length > 0) {
    await db.delete(postTags).where(and(eq(postTags.postId, post.id), inArray(postTags.tagId, toRemove)))
  }
  if (toAdd.length > 0) {
    await db.insert(postTags).values(toAdd.map((tagId) => ({ postId: post.id, tagId }))).onConflictDoNothing()
  }
  console.log('Applied. Re-running this script is a no-op.')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
