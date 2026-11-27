/**
 * The site brand and the title helpers built on it. Dependency-free so
 * client components (blog cover fallbacks) can strip a stored brand suffix
 * without pulling site metadata, project data or stats into their bundle.
 */

export const BRAND = 'Richard Hudson'

/**
 * Append the brand exactly once as " | brand". Any existing separated brand
 * suffix (" | ", " – ", " — ", " - ") is normalized first, so the result is
 * idempotent and never doubles the brand.
 */
export function brandTitle(title: string): string {
  const base = stripBrandSuffix(title)
  return base ? `${base} | ${BRAND}` : BRAND
}

/**
 * Remove a trailing brand suffix ("| Richard Hudson", en/em dash, hyphen).
 * Deliberately regex-free so it is linear-time on adversarial DB input.
 */
export function stripBrandSuffix(title: string): string {
  const trimmed = title.trim()
  const brand = BRAND.toLowerCase()
  if (!trimmed.toLowerCase().endsWith(brand)) return trimmed
  const before = trimmed.slice(0, trimmed.length - brand.length).trimEnd()
  if (before === '') return ''
  const last = before.charAt(before.length - 1)
  // Only a free-standing separator immediately before the brand marks it as a
  // suffix. A title that merely ends with the name ("Interview with Richard
  // Hudson") or glues a hyphen to a word ("Anti-Richard Hudson") is kept.
  const isSeparator = last === '|' || last === '–' || last === '—' || last === '-'
  const prev = before.charAt(before.length - 2)
  const freeStanding = prev === '' || prev === ' ' || prev === '\t'
  if (isSeparator && freeStanding) {
    return before.slice(0, -1).trim()
  }
  return trimmed
}

/**
 * A stored post title without a trailing brand suffix (" | Richard Hudson"),
 * full length otherwise. For surfaces that name the article rather than act as
 * a search-result title (JSON-LD headline, breadcrumbs, the /api/og card, RSS
 * item titles), so the 60-char budget does not apply but a stored brand would
 * otherwise show twice. Falls back to the trimmed title if it is only the brand.
 */
export function displayPostTitle(title: string): string {
  return stripBrandSuffix(title) || title.trim()
}
