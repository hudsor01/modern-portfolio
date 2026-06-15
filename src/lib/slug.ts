/**
 * URL-safe slug generation. Kept dependency-free (no DB / no `server-only`
 * imports) so it can be reused from Node CLI scripts in `scripts/*` as well as
 * from server route handlers. `src/lib/api-blog.ts` re-exports `generateSlug`
 * for existing callers.
 */

/**
 * Build a URL-safe slug from arbitrary text.
 *
 * `maxLength` (default 100 — the `slugSchema` ceiling in src/lib/schemas.ts) is
 * enforced by truncating at the last word boundary that fits, NEVER mid-word,
 * and re-stripping any trailing hyphen. A naive `.slice(0, n)` (as a
 * since-removed bulk import did) cuts mid-word and can leave a dangling hyphen,
 * producing low-quality URLs like `…vanity-metri` or `…that-fixes-` that also
 * fail slugSchema's `^[a-z0-9]+(?:-[a-z0-9]+)*$` regex.
 */
export function generateSlug(text: string, maxLength = 100): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim()

  if (base.length <= maxLength) return base

  let truncated = base.slice(0, maxLength)
  // If the cut landed inside a word (the next char isn't a separator), back up
  // to the last word boundary so we never ship a half-word. A single token
  // longer than maxLength has no interior hyphen and is hard-cut as a fallback.
  if (base[maxLength] !== '-') {
    const lastHyphen = truncated.lastIndexOf('-')
    if (lastHyphen > 0) truncated = truncated.slice(0, lastHyphen)
  }
  return truncated.replace(/-+$/, '')
}
