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

    const fzRows = await db.execute(sql`
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
      LIMIT ${Math.max(0, limit - fullTextResults.length)}
      OFFSET ${offset}
    `)
    const fuzzyResults = fzRows as unknown as SearchResult[]

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

  let highlighted = text

  for (const term of terms) {
    // Escape regex metacharacters — terms come from user query strings, so
    // an unescaped `(`, `[`, `\`, `?`, etc. would throw SyntaxError and
    // bubble up through highlightSearchTerms callers.
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi')
    highlighted = highlighted.replace(regex, '<mark>$1</mark>')
  }

  return highlighted
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
