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

/**
 * Shift every heading down one level (h1→h2 … h5→h6; h6 unchanged) so body
 * markdown never emits an `<h1>` that competes with the page title's `<h1>`.
 * A double-h1 confuses Google's content-hierarchy parser; this preserves the
 * visual hierarchy (the `prose` wrapper styles h2–h6) while fixing semantics.
 *
 * Processed high→low so a heading demoted on one pass isn't demoted again.
 */
function demoteHeadings(html: string): string {
  let out = html
  for (let level = 5; level >= 1; level--) {
    const next = level + 1
    out = out
      .replace(new RegExp(`<h${level}(\\s[^>]*)?>`, 'gi'), `<h${next}$1>`)
      .replace(new RegExp(`</h${level}>`, 'gi'), `</h${next}>`)
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
