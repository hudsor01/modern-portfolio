/**
 * Full-Text Search Utilities for PostgreSQL
 * Uses tsvector and trigram indexes for fast, typo-tolerant search
 */

import { db } from '@/lib/db'
import { Prisma } from '@/generated/prisma/client'

export interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  rank: number
  matchType: 'exact' | 'fuzzy'
}

/**
 * Search blog posts using PostgreSQL full-text search
 *
 * @param query - Search query string
 * @param options - Search options
 * @returns Array of blog post IDs with relevance ranking
 */
export async function searchBlogPosts(
  query: string,
  options: {
    limit?: number
    offset?: number
    statusFilter?: string[]
  } = {}
): Promise<SearchResult[]> {
  const { limit = 20, offset = 0, statusFilter } = options

  // Sanitize query - remove special characters that could break tsquery
  const sanitizedQuery = query
    .replace(/[<>!*():|&]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0)
    .join(' & ') // Use AND operator between terms

  if (!sanitizedQuery) {
    return []
  }

  // Build status filter for WHERE clause
  const statusCondition = statusFilter && statusFilter.length > 0
    ? Prisma.sql`AND status = ANY(${statusFilter})`
    : Prisma.empty

  let fullTextResults: SearchResult[] = []

  try {
    // Primary: Full-text search using tsvector
    fullTextResults = await db.$queryRaw<SearchResult[]>`
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
    `

    // If full-text search found enough results, return them
    if (fullTextResults.length >= Math.min(limit, 5)) {
      return fullTextResults
    }

    // Fallback: Trigram fuzzy search for typos/misspellings
    // Only if full-text search didn't find enough results
    const needsFuzzySearch = fullTextResults.length < Math.min(limit, 5)
    const fuzzyResults = needsFuzzySearch ? await db.$queryRaw<SearchResult[]>`
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
        ${fullTextResults.length > 1
          ? Prisma.sql`AND id NOT IN (${Prisma.join(fullTextResults.map(r => r.id))})`
          : fullTextResults.length === 1
            ? Prisma.sql`AND id != ${fullTextResults[0]!.id}`
            : Prisma.empty}
      ORDER BY rank DESC
      LIMIT ${Math.max(0, limit - fullTextResults.length)}
      OFFSET ${offset}
    ` : []

    // Combine exact and fuzzy results
    return [...fullTextResults, ...fuzzyResults]
  } catch (error) {
    console.error('Search error during fuzzy fallback:', error)
    // Return full-text results even if fuzzy search fails
    // Better to return partial results than nothing
    return fullTextResults
  }
}

/**
 * Highlight search terms in text
 *
 * @param text - Text to highlight
 * @param query - Search query
 * @returns Text with search terms wrapped in <mark> tags
 */
export function highlightSearchTerms(text: string, query: string): string {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 2) // Only highlight terms with 3+ chars

  let highlighted = text

  for (const term of terms) {
    const regex = new RegExp(`(${term})`, 'gi')
    highlighted = highlighted.replace(regex, '<mark>$1</mark>')
  }

  return highlighted
}

/**
 * Generate search suggestions/autocomplete
 *
 * @param prefix - Search prefix
 * @param limit - Maximum suggestions to return
 * @returns Array of suggested search terms
 */
export async function getSearchSuggestions(
  prefix: string,
  limit: number = 5
): Promise<string[]> {
  if (prefix.length < 2) {
    return []
  }

  try {
    // Get popular keywords that match prefix
    const suggestions = await db.$queryRaw<{ keyword: string; count: bigint }[]>`
      SELECT
        unnest(keywords) as keyword,
        COUNT(*) as count
      FROM blog_posts
      WHERE status = 'PUBLISHED'
        AND EXISTS (
          SELECT 1
          FROM unnest(keywords) k
          WHERE k ILIKE ${prefix + '%'}
        )
      GROUP BY keyword
      HAVING keyword ILIKE ${prefix + '%'}
      ORDER BY count DESC, keyword
      LIMIT ${limit}
    `

    return suggestions.map(s => s.keyword)
  } catch (error) {
    console.error('Search suggestions error:', error)
    return []
  }
}
