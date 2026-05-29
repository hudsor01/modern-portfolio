/**
 * Fix #119 — repair the truncated <title> and preview text on the
 * "Stop Guessing… by 34% in One Quarter" post.
 *
 * The stored metaTitle and excerpt/metaDescription were cut mid-word
 * ("…by 34% in O", "…relying on hard data. T"). This rewrites them to clean,
 * word-boundary values derived from the post's own title + content:
 *   - metaTitle      := the full post title (complete; search engines truncate
 *                       the *display*, but the tag itself must not end mid-word)
 *   - excerpt        := first ~155 chars of the content, cut on a word boundary
 *   - metaDescription:= same clean summary (column is varchar(160))
 *
 * Idempotent: the derived values are deterministic, so re-running is a no-op.
 * Safe by default — prints before/after and changes nothing unless APPLY=1.
 *
 *   bun run scripts/fix-truncated-blog-meta.ts          # dry run (preview)
 *   APPLY=1 bun run scripts/fix-truncated-blog-meta.ts  # commit changes
 */
import { eq } from 'drizzle-orm'
import { blogPosts } from '../src/db/schema'
import { createScriptDb } from './_db'

const db = createScriptDb({ blogPosts })

const POST_SLUG = 'stop-guessing-how-we-crushed-forecasting-errors-by-34-in-one-quarter'
const MAX_DESC = 157 // leave room for the ellipsis within varchar(160)
const APPLY = process.env.APPLY === '1'

/** Strip markdown/HTML to plain prose for a clean preview snippet. */
function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ') // fenced code
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/[*_>#~]/g, '') // emphasis / blockquote markers
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim()
}

/** Truncate on a word boundary, appending an ellipsis only if cut. */
function wordBoundarySummary(text: string, max: number): string {
  if (text.length <= max) return text
  const slice = text.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  const base = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).replace(/[\s.,;:!-]+$/, '')
  return `${base}…`
}

async function main() {
  const post = (
    await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        metaTitle: blogPosts.metaTitle,
        metaDescription: blogPosts.metaDescription,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
      })
      .from(blogPosts)
      .where(eq(blogPosts.slug, POST_SLUG))
  )[0]
  if (!post) {
    throw new Error(`Post not found: ${POST_SLUG}`)
  }

  const cleanMetaTitle = post.title.trim()
  const summary = wordBoundarySummary(toPlainText(post.content), MAX_DESC)

  const show = (label: string, v: string | null) =>
    console.log(`  ${label.padEnd(16)} (${(v ?? '').length}) ${JSON.stringify(v)}`)

  console.log('BEFORE')
  show('metaTitle', post.metaTitle)
  show('excerpt', post.excerpt)
  show('metaDescription', post.metaDescription)
  console.log('AFTER')
  show('metaTitle', cleanMetaTitle)
  show('excerpt', summary)
  show('metaDescription', summary)

  const unchanged =
    post.metaTitle === cleanMetaTitle && post.excerpt === summary && post.metaDescription === summary
  if (unchanged) {
    console.log('\nAlready clean — no-op.')
    return
  }
  if (!APPLY) {
    console.log('\nDRY RUN — re-run with APPLY=1 to commit.')
    return
  }

  await db
    .update(blogPosts)
    .set({ metaTitle: cleanMetaTitle, excerpt: summary, metaDescription: summary })
    .where(eq(blogPosts.id, post.id))
  console.log('\nApplied. Re-running this script is a no-op.')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
