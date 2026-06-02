/**
 * Full-Text Search Utilities for PostgreSQL
 * Uses tsvector and trigram indexes for fast, typo-tolerant search.
 *
 * Requires the `search_vector` column on `blog_posts` and the trigram +
 * tsvector indexes installed by the legacy `add_fulltext_search.sql`
 * migration (still applied to the production DB; not part of the Drizzle
 * migration history).
 */

import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { escapeRegExp } from '@/lib/utils'

export interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  rank: number
  matchType: 'exact' | 'fuzzy'
}

/**
 * The fuzzy fallback uses the `%` similarity operator, which only exists when
 * the `pg_trgm` extension is installed. Probe for it once per process and
 * cache the result so a missing extension degrades to an `ILIKE` substring
 * fallback instead of throwing (and silently returning only the full-text
 * hits via the outer catch). `null` = not yet probed.
 */
let pgTrgmAvailable: boolean | null = null

async function hasPgTrgm(): Promise<boolean> {
  if (pgTrgmAvailable !== null) {
    return pgTrgmAvailable
  }
  try {
    const rows = await db.execute(sql`SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm' LIMIT 1`)
    pgTrgmAvailable = (rows as unknown as unknown[]).length > 0
  } catch {
    pgTrgmAvailable = false
  }
  return pgTrgmAvailable
}

/** Test-only hook to reset the cached `pg_trgm` probe between cases. */
export function __resetPgTrgmCache(): void {
  pgTrgmAvailable = null
}

export async function searchBlogPosts(
  query: string,
  options: {
    limit?: number
    offset?: number
    statusFilter?: string[]
  } = {}
): Promise<SearchResult[]> {
  const { limit = 20, offset = 0, statusFilter } = options

  const sanitizedQuery = query
    .replace(/[<>!*():|&]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 0)
    .join(' & ')

  if (!sanitizedQuery) {
    return []
  }

  const statusCondition =
    statusFilter && statusFilter.length > 0 ? sql`AND status = ANY(${statusFilter})` : sql``

  let fullTextResults: SearchResult[] = []

  try {
    const ftRows = await db.execute(sql`
      SELECT
        id,
        title,
        slug,
        excerpt,
        ts_rank(search_vector, plainto_tsquery('english', ${query})) as rank,
        'exact' as "matchType"
      FROM blog_posts
      WHERE search_vector @@ plainto_tsquery('english', ${query})
        ${statusCondition}
      ORDER BY rank DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `)
    fullTextResults = ftRows as unknown as SearchResult[]

    if (fullTextResults.length >= Math.min(limit, 5)) {
      return fullTextResults
    }

    const needsFuzzySearch = fullTextResults.length < Math.min(limit, 5)
    if (!needsFuzzySearch) {
      return fullTextResults
    }

    const exclusion =
      fullTextResults.length > 0
        ? sql`AND id NOT IN (${sql.join(
            fullTextResults.map((r) => sql`${r.id}`),
            sql`, `
          )})`
        : sql``

    const fuzzyLimit = Math.max(0, limit - fullTextResults.length)

    let fuzzyRows: unknown
    if (await hasPgTrgm()) {
      // Trigram similarity ranking (typo-tolerant). Requires pg_trgm.
      fuzzyRows = await db.execute(sql`
        SELECT
          id,
          title,
          slug,
          excerpt,
          GREATEST(
            similarity(title, ${query}),
            similarity(COALESCE(excerpt, ''), ${query})
          ) as rank,
          'fuzzy' as "matchType"
        FROM blog_posts
        WHERE (title % ${query} OR COALESCE(excerpt, '') % ${query})
          ${statusCondition}
          ${exclusion}
        ORDER BY rank DESC
        LIMIT ${fuzzyLimit}
        OFFSET ${offset}
      `)
    } else {
      // pg_trgm absent — fall back to a case-insensitive substring match so
      // search still degrades gracefully instead of returning only the
      // full-text hits. LIKE wildcards in the user's query are escaped so
      // they're treated literally. Title matches rank above excerpt matches.
      const likePattern = `%${query.replace(/[\\%_]/g, '\\$&')}%`
      fuzzyRows = await db.execute(sql`
        SELECT
          id,
          title,
          slug,
          excerpt,
          CASE WHEN title ILIKE ${likePattern} THEN 0.6 ELSE 0.3 END as rank,
          'fuzzy' as "matchType"
        FROM blog_posts
        WHERE (title ILIKE ${likePattern} OR COALESCE(excerpt, '') ILIKE ${likePattern})
          ${statusCondition}
          ${exclusion}
        ORDER BY rank DESC, title ASC
        LIMIT ${fuzzyLimit}
        OFFSET ${offset}
      `)
    }
    const fuzzyResults = fuzzyRows as unknown as SearchResult[]

    return [...fullTextResults, ...fuzzyResults]
  } catch (error) {
    logger.error(
      'Search error during fuzzy fallback',
      error instanceof Error ? error : new Error(String(error))
    )
    return fullTextResults
  }
}

export function highlightSearchTerms(text: string, query: string): string {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 2)

  // No terms survive the length filter → nothing to mark. Guard before building
  // the regex: an empty alternation (`()`) would match the empty string at every
  // position and wrap the whole text in <mark>.
  if (terms.length === 0) {
    return text
  }

  // Single alternation over all terms — one compile + one pass instead of
  // recompiling a regex and re-scanning the text per term. Each term is regex-
  // escaped: terms come from user query strings, so an unescaped `(`, `[`, `\`,
  // `?`, etc. would throw SyntaxError and bubble up through callers.
  const regex = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

export async function getSearchSuggestions(prefix: string, limit: number = 5): Promise<string[]> {
  if (prefix.length < 2) {
    return []
  }

  try {
    const rows = await db.execute(sql`
      SELECT
        unnest(keywords) as keyword,
        COUNT(*) as count
      FROM blog_posts
      WHERE status = 'PUBLISHED'
        AND EXISTS (
          SELECT 1
          FROM unnest(keywords) k
          WHERE k ILIKE ${`${prefix}%`}
        )
      GROUP BY keyword
      HAVING keyword ILIKE ${`${prefix}%`}
      ORDER BY count DESC, keyword
      LIMIT ${limit}
    `)

    return (rows as unknown as { keyword: string }[]).map((s) => s.keyword)
  } catch (error) {
    logger.error(
      'Search suggestions error',
      error instanceof Error ? error : new Error(String(error))
    )
    return []
  }
}
