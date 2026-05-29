/**
 * Fix #119 — repair mid-word-truncated metaTitle / excerpt / metaDescription
 * across all live blog posts.
 *
 * The audit named one post ("…by 34% in One Quarter"), but that post is now
 * soft-deleted (GSC consolidation). The underlying defect — a CMS that hard-cut
 * metaTitle at 60 chars and excerpt/metaDescription mid-content — affects the
 * surviving published posts too. This scans every PUBLISHED, non-deleted post
 * and repairs only fields that are demonstrably auto-truncated:
 *
 *   - metaTitle: fixed only when it is a strict *prefix* of the full title
 *     (i.e. the title was cut). A genuinely custom metaTitle is left alone.
 *   - excerpt / metaDescription: fixed only when the stored value is a prefix
 *     slice of the post body (auto-generated), replaced with a clean
 *     word-boundary summary. Hand-written copy that isn't a body slice is
 *     left untouched.
 *
 * Idempotent (derived values are deterministic). Dry-run by default.
 *   bun run scripts/fix-truncated-blog-meta.ts          # preview
 *   APPLY=1 bun run scripts/fix-truncated-blog-meta.ts  # commit
 */
import { and, eq, isNull } from 'drizzle-orm'
import { blogPosts } from '../src/db/schema'
import { createScriptDb } from './_db'

const db = createScriptDb({ blogPosts })

const MAX_DESC = 157 // metaDescription is varchar(160); leave room for the ellipsis
const MAX_EXCERPT = 300 // preserve the original on-page preview length
const APPLY = process.env.APPLY === '1'

/** Strip the leading H1 + markdown/HTML to plain prose. */
function toPlainText(md: string): string {
  return md
    .replace(/^\s*#\s+.*$/m, '') // leading H1 heading
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

/**
 * A stored excerpt/description is an auto-slice of the body if the body starts
 * with it minus its trailing (possibly partial) word. Catches both clean and
 * mid-word cuts while sparing genuinely-authored copy.
 */
function isBodySlice(field: string, plainBody: string): boolean {
  const probe = field.replace(/[…\s]*\S*$/, '').trim() // drop trailing (partial) word / ellipsis
  return probe.length >= 20 && plainBody.startsWith(probe) && field.trim() !== plainBody
}

async function main() {
  const posts = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      metaTitle: blogPosts.metaTitle,
      metaDescription: blogPosts.metaDescription,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
    })
    .from(blogPosts)
    .where(and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt)))

  console.log(`Scanning ${posts.length} published posts…\n`)

  let changed = 0
  for (const p of posts) {
    const title = p.title.trim()
    const plainBody = toPlainText(p.content)
    const excerptSummary = wordBoundarySummary(plainBody, MAX_EXCERPT)
    const descSummary = wordBoundarySummary(plainBody, MAX_DESC)

    const set: { metaTitle?: string; excerpt?: string; metaDescription?: string } = {}

    // metaTitle: only repair a prefix-truncation of the title.
    if (p.metaTitle && p.metaTitle !== title && title.startsWith(p.metaTitle)) {
      set.metaTitle = title
    }
    // excerpt: repair only auto-sliced bodies (preserve ~original length).
    if (p.excerpt && p.excerpt !== excerptSummary && isBodySlice(p.excerpt, plainBody)) {
      set.excerpt = excerptSummary
    }
    // metaDescription: repair only auto-sliced bodies (varchar(160)-safe).
    if (p.metaDescription && p.metaDescription !== descSummary && isBodySlice(p.metaDescription, plainBody)) {
      set.metaDescription = descSummary
    }

    if (Object.keys(set).length === 0) continue
    changed++
    console.log(`• ${p.slug}`)
    if (set.metaTitle) console.log(`    metaTitle: ${JSON.stringify(p.metaTitle)} → ${JSON.stringify(set.metaTitle)}`)
    if (set.excerpt) console.log(`    excerpt:   ${JSON.stringify(p.excerpt?.slice(-30))} → …${JSON.stringify(set.excerpt.slice(-30))}`)
    if (set.metaDescription) console.log(`    metaDesc:  ${JSON.stringify(p.metaDescription?.slice(-30))} → …${JSON.stringify(set.metaDescription.slice(-30))}`)

    if (APPLY) {
      await db.update(blogPosts).set(set).where(eq(blogPosts.id, p.id))
    }
  }

  console.log(`\n${changed} post(s) ${APPLY ? 'updated' : 'need repair'}.`)
  if (!APPLY && changed > 0) console.log('DRY RUN — re-run with APPLY=1 to commit.')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
