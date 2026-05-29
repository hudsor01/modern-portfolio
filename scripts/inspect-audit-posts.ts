/**
 * READ-ONLY inspection for audit findings #119 and #125.
 *
 * Prints the current production state of:
 *   - all `stop-guessing-*` posts (which are published vs soft-deleted) and
 *     the truncated metaTitle/excerpt/metaDescription for the #119 post
 *   - the Multi-Touch Attribution post's current tags (#125)
 *
 * Mutates nothing. Run: `bun run scripts/inspect-audit-posts.ts`
 */
import { eq, like } from 'drizzle-orm'
import { blogPosts, postTags, tags } from '../src/db/schema'
import { createScriptDb } from './_db'

const db = createScriptDb({ blogPosts, postTags, tags })

const TRUNC_SLUG = 'stop-guessing-how-we-crushed-forecasting-errors-by-34-in-one-quarter'
const ATTR_SLUG = 'multi-touch-attribution-modeling-best-practices'

function show(label: string, value: unknown) {
  const s = value == null ? '∅' : String(value)
  console.log(`  ${label.padEnd(18)} (${s.length}) ${JSON.stringify(s)}`)
}

async function main() {
  console.log('\n=== #119: stop-guessing-* posts ===')
  const sg = await db
    .select({
      slug: blogPosts.slug,
      status: blogPosts.status,
      deletedAt: blogPosts.deletedAt,
      title: blogPosts.title,
      metaTitle: blogPosts.metaTitle,
      metaDescription: blogPosts.metaDescription,
      excerpt: blogPosts.excerpt,
      contentLen: blogPosts.content,
    })
    .from(blogPosts)
    .where(like(blogPosts.slug, 'stop-guessing-%'))

  for (const p of sg) {
    const isTarget = p.slug === TRUNC_SLUG
    console.log(
      `\n${isTarget ? '>>> ' : '    '}${p.slug}  [${p.status}${p.deletedAt ? ' DELETED' : ''}]`
    )
    if (isTarget) {
      show('title', p.title)
      show('metaTitle', p.metaTitle)
      show('metaDescription', p.metaDescription)
      show('excerpt', p.excerpt)
      const content = (p.contentLen as unknown as string) ?? ''
      console.log(`  content len: ${content.length}`)
      console.log(`  content head: ${JSON.stringify(content.slice(0, 320))}`)
    }
  }
  if (!sg.some((p) => p.slug === TRUNC_SLUG)) {
    console.log(`\n!!! target slug not found: ${TRUNC_SLUG}`)
  }

  console.log('\n=== #125: Multi-Touch Attribution post tags ===')
  const post = await db
    .select({ id: blogPosts.id, slug: blogPosts.slug, title: blogPosts.title })
    .from(blogPosts)
    .where(eq(blogPosts.slug, ATTR_SLUG))
  if (post.length === 0) {
    console.log(`!!! attribution post not found: ${ATTR_SLUG}`)
  } else {
    const target = post[0]!
    console.log(`  post: ${target.title} (${target.id})`)
    const linked = await db
      .select({ tagName: tags.name, tagSlug: tags.slug })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, target.id))
    console.log(`  current tags: ${JSON.stringify(linked)}`)
  }

  console.log('\n=== available attribution-relevant tags in DB ===')
  const candidate = await db
    .select({ name: tags.name, slug: tags.slug })
    .from(tags)
    .where(like(tags.slug, '%attribution%'))
  console.log(`  attribution-* tags: ${JSON.stringify(candidate)}`)
  const marketing = await db
    .select({ name: tags.name, slug: tags.slug })
    .from(tags)
    .where(like(tags.slug, '%marketing%'))
  console.log(`  marketing-* tags: ${JSON.stringify(marketing)}`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
