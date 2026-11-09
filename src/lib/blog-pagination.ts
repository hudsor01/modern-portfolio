/**
 * Pagination helpers for the /blog index. Pure, so they run on the server
 * page and in the client list alike, and are unit-tested without a database.
 */

/** Posts per /blog page. Divisible by the 2- and 3-column grid widths. */
export const BLOG_PAGE_SIZE = 24

/** The "no category filter" value of `?category=`. */
export const ALL_CATEGORIES = 'All'

/** First value of a search param that Next may hand over as `string[]`. */
function firstValue(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw
}

/**
 * Parse `?page=`. Anything other than a plain positive integer (missing,
 * `abc`, `0`, `-1`, `1.5`, `2e3`) is page 1 rather than an error: the URL is
 * crawler-reachable and junk values should land on the canonical first page.
 */
export function parsePageParam(raw: string | string[] | undefined): number {
  const value = firstValue(raw)?.trim()
  if (!value || !/^[1-9]\d{0,5}$/.test(value)) return 1
  return Number(value)
}

/** Normalise `?category=` (a category name) to one trimmed value or `All`. */
export function parseCategoryParam(raw: string | string[] | undefined): string {
  return firstValue(raw)?.trim() || ALL_CATEGORIES
}

/** Number of pages for `total` posts. Never less than 1, so page 1 always exists. */
export function pageCount(total: number, pageSize: number = BLOG_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize))
}

/** The slice of `items` shown on `page` (1-based). */
export function pageSlice<T>(items: readonly T[], page: number, pageSize = BLOG_PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

/**
 * URL of a /blog listing page. Page 1 and the `All` category are omitted so the
 * first page of the unfiltered index is always the bare canonical `/blog`.
 */
export function blogIndexHref({
  page = 1,
  query = '',
  category = ALL_CATEGORIES,
}: {
  page?: number
  query?: string
  category?: string
}): string {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (category && category !== ALL_CATEGORIES) params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const search = params.toString()
  return search ? `/blog?${search}` : '/blog'
}

/**
 * Page numbers to render, with `'gap'` where a run is elided: always the first
 * and last page plus the current page and its neighbours.
 * `paginationItems(6, 10)` -> `[1, 'gap', 5, 6, 7, 'gap', 10]`.
 */
export function paginationItems(current: number, total: number): Array<number | 'gap'> {
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const items: Array<number | 'gap'> = []
  for (const p of sorted) {
    const prev = items.at(-1)
    if (typeof prev === 'number' && p - prev > 1) {
      // A gap of exactly one page is cheaper to show than to elide.
      if (p - prev === 2) items.push(prev + 1)
      else items.push('gap')
    }
    items.push(p)
  }
  return items
}
