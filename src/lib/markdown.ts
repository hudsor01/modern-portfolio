import { marked } from 'marked'

/**
 * Markdown rendering for trusted blog-post bodies.
 *
 * Replaces a hand-rolled regex parser that escaped the whole document up front
 * and then re-escaped URLs — which double-escaped every href/src, never
 * rendered images (the link pass consumed `![alt](url)` first), and never
 * matched relative URLs (`/` had already become `&#x2F;`). `marked` tokenizes
 * correctly; heading demotion and external-link hardening are applied as
 * post-passes.
 *
 * Output is intentionally NOT sanitized here: the caller gates DOMPurify on the
 * browser (`BlogPostArticle.sanitizeHtml`), matching the existing HTML/RICH_TEXT
 * path. Blog content is trusted (token-gated admin writes), not user input.
 */
export function markdownToHtml(markdown: string): string {
  const html = marked.parse(markdown, { gfm: true, breaks: true }) as string
  return externalizeLinks(demoteHeadings(html))
}

// Heading-demotion passes, ordered high→low so a heading demoted on one pass
// isn't demoted again. Compiled once at module load rather than rebuilding 10
// RegExp objects on every render. Global regexes are safe to reuse across
// calls: String.prototype.replace resets lastIndex when it completes.
const HEADING_DEMOTIONS = [5, 4, 3, 2, 1].map((level) => ({
  openTag: new RegExp(`<h${level}(\\s[^>]*)?>`, 'gi'),
  closeTag: new RegExp(`</h${level}>`, 'gi'),
  openReplacement: `<h${level + 1}$1>`,
  closeReplacement: `</h${level + 1}>`,
}))

/**
 * Shift every heading down one level (h1→h2 … h5→h6; h6 unchanged) so body
 * markdown never emits an `<h1>` that competes with the page title's `<h1>`.
 * A double-h1 confuses Google's content-hierarchy parser; this preserves the
 * visual hierarchy (the `prose` wrapper styles h2–h6) while fixing semantics.
 */
function demoteHeadings(html: string): string {
  let out = html
  for (const { openTag, closeTag, openReplacement, closeReplacement } of HEADING_DEMOTIONS) {
    out = out.replace(openTag, openReplacement).replace(closeTag, closeReplacement)
  }
  return out
}

/**
 * Add `target="_blank" rel="noopener noreferrer"` to external (http/https)
 * links. `marked` emits bare `<a href>`; relative/anchor links are left as-is.
 */
function externalizeLinks(html: string): string {
  return html.replace(
    /<a href="(https?:\/\/[^"]*)"/gi,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  )
}

/**
 * Decode the five HTML entities `marked` escapes in code-fence content back to
 * their characters, so a `<CodeBlock>` (which renders the value as React text,
 * re-escaping it) displays the original source instead of double-escaped
 * entities. `&amp;` is decoded last to avoid re-introducing other entities.
 */
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

/** Lower-cased plain text of a title/heading: markup, entities, emphasis marks and spacing removed. */
export function normalizeTitle(value: string): string {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, ''))
    .replace(/[*_`]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/**
 * Drop a leading `<h1>` to `<h3>` whose text repeats the post title. The page header
 * already renders the title as the H1, and stored bodies often open with the same
 * line again. Render-time only: the stored post is never touched. Any other
 * opening heading is kept.
 */
export function stripLeadingTitleHeading(html: string, title: string): string {
  const m = /^\s*<h([1-3])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/i.exec(html)
  if (!m) return html
  const target = normalizeTitle(title)
  if (target && normalizeTitle(m[2] ?? '') === target)
    return promoteHeadings(html.slice(m[0].length))
  return html
}

/**
 * Shift headings up so the shallowest becomes an `<h2>`. With the repeated title
 * gone, a body whose sections were `<h3>` under it would jump from the page `<h1>`
 * straight to `<h3>` (axe heading-order). Relative levels are preserved.
 */
function promoteHeadings(html: string): string {
  let min = 7
  for (const m of html.matchAll(/<h([1-6])[\s>]/gi)) min = Math.min(min, Number(m[1]))
  const shift = min - 2
  if (min > 6 || shift <= 0) return html
  return html.replace(/<(\/?)h([1-6])(?=[\s>])/gi, (_, slash: string, level: string) => {
    return `<${slash}h${Number(level) - shift}`
  })
}
