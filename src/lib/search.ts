/**
 * Full-Text Search Utilities for PostgreSQL
 * Uses tsvector and trigram indexes for fast, typo-tolerant search.
 *
 * Backed by `blog_posts.search_vector` — a GENERATED ALWAYS tsvector column
 * (title weighted A, excerpt B, content C) with a GIN index, plus trigram GIN
 * indexes on title/excerpt. All four are defined in src/db/schema.ts and
 * created by drizzle/migrations/0001_hard_maverick.sql.
 *
 * Until that migration this module was unreachable *and* wrong: its header
 * claimed the column was "installed by the legacy add_fulltext_search.sql
 * migration (still applied to the production DB)", but no such column existed
 * in the database, the Drizzle schema, or any migration. Every call threw
 * 42703, hit the outer catch, and returned []. Nothing referenced the module,
 * so nothing surfaced it.
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
 * Unwrap a `db.execute()` result into its rows.
 *
 * `db.execute()` does NOT return an array. The neon-http driver calls with
 * `fullResults: true`, so it resolves to a pg-style result object —
 * `{ rows, fields, command, rowCount, ... }`. Every call site here previously
 * did `result as unknown as T[]` and then read `.length`, which is `undefined`
 * on an object; `undefined > 0` and `undefined < 5` are both `false`, so the
 * capability probe reported "no pg_trgm" and the result-count branches took the
 * wrong path. The double `as unknown as` cast is why `tsc` never objected.
 *
 * Funnelling every call through one helper is the actual fix: the shape is
 * asserted in exactly one place instead of being re-guessed six times. It also
 * tolerates a driver that does return a bare array, so swapping drivers cannot
 * silently reintroduce the bug.
 */
function rowsOf<T>(result: unknown): T[] {
  if (Array.isArray(result)) {
    return result as T[]
  }
  const rows = (result as { rows?: unknown })?.rows
  return Array.isArray(rows) ? (rows as T[]) : []
}

/**
 * Minimum `word_similarity()` for a trigram match to count as a typo.
 *
 * Measured against the live corpus rather than guessed. Real misspellings score
 * 0.50–0.77 ("atribution" 0.769, "forcasting" 0.643, "pipline" 0.545,
 * "analitics" 0.538, "revnue" 0.500); unrelated words score 0.09–0.15
 * ("photosynthesis" 0.150, "zzzqqq" 0.143, "kubernetes" 0.091). 0.45 sits in
 * the gap with margin on both sides.
 *
 * Note this is `word_similarity`, not `similarity`. The original code used the
 * `%` operator, which compares the query against the *entire* title string — a
 * one-word query against a nine-word title scores near zero, so `%` matched
 * nothing at all and the "typo-tolerant" path was decorative. `word_similarity`
 * scores the query against the best-matching extent within the title.
 */
const TRIGRAM_MATCH_THRESHOLD = 0.45

/**
 * The fuzzy fallback calls `word_similarity()`, which only exists when the
 * `pg_trgm` extension is installed. Probe for it once per process and cache the
 * result so a missing extension degrades to an `ILIKE` substring fallback
 * instead of throwing (and silently returning only the full-text hits via the
 * outer catch). `null` = not yet probed.
 */
let pgTrgmAvailable: boolean | null = null

async function hasPgTrgm(): Promise<boolean> {
  if (pgTrgmAvailable !== null) {
    return pgTrgmAvailable
  }
  try {
    const result = await db.execute(
      sql`SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm' LIMIT 1`
    )
    pgTrgmAvailable = rowsOf(result).length > 0
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

  // Strip tsquery operators so user input can never be parsed as query syntax.
  // Terms are joined with a space, not ' & ': the target is plainto_tsquery,
  // which treats its whole argument as plain text and ANDs the terms itself —
  // an interleaved '&' is just a non-word token it discards. The old ' & ' join
  // implied an operator that was never honoured.
  const sanitizedQuery = query
    .replace(/[<>!*():|&]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 0)
    .join(' ')

  if (!sanitizedQuery) {
    return []
  }

  // Build the array from individual bound params via sql.join — the same idiom
  // the `exclusion` clause below uses — rather than interpolating the JS array
  // directly.
  //
  // `sql`ANY(${statusFilter}::"PostStatus"[])`` emits `ANY(($1)::"PostStatus"[])`
  // and binds the array as one parameter, which Postgres rejects with 22P02
  // (invalid input syntax). That throw lands in the outer catch and this
  // function returns [] — a status-filtered search silently finding nothing
  // rather than erroring. sql.join emits `ANY(ARRAY[$1, $2, …]::"PostStatus"[])`,
  // which binds each value separately and works.
  const statusCondition =
    statusFilter && statusFilter.length > 0
      ? sql`AND status = ANY(ARRAY[${sql.join(
          statusFilter.map((s) => sql`${s}`),
          sql`, `
        )}]::"PostStatus"[])`
      : sql``

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
    fullTextResults = rowsOf<SearchResult>(ftRows)

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
      // Trigram ranking (typo-tolerant). Requires pg_trgm.
      //
      // word_similarity(query, target), not similarity(a, b): the latter
      // compares whole strings, so a single misspelled word against a full
      // title scores below any usable threshold and this branch returned
      // nothing. Argument order matters — word_similarity looks for the FIRST
      // argument inside the second.
      fuzzyRows = await db.execute(sql`
        SELECT
          id,
          title,
          slug,
          excerpt,
          GREATEST(
            word_similarity(${query}, title),
            word_similarity(${query}, COALESCE(excerpt, ''))
          ) as rank,
          'fuzzy' as "matchType"
        FROM blog_posts
        WHERE GREATEST(
            word_similarity(${query}, title),
            word_similarity(${query}, COALESCE(excerpt, ''))
          ) >= ${TRIGRAM_MATCH_THRESHOLD}
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
    const fuzzyResults = rowsOf<SearchResult>(fuzzyRows)

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
    // Unnest in a subquery so the outer query can filter on `keyword` in WHERE.
    //
    // The previous shape selected `unnest(keywords) AS keyword` and then wrote
    // `HAVING keyword ILIKE …`, which Postgres rejects with
    // `column "keyword" does not exist` — GROUP BY may reference a select-list
    // alias, HAVING may not. Every call threw and returned []. Filtering in the
    // subquery is also cheaper than the old correlated EXISTS: it expands the
    // keyword arrays once instead of per candidate row.
    const rows = await db.execute(sql`
      SELECT keyword, COUNT(*) as count
      FROM (
        SELECT unnest(keywords) as keyword
        FROM blog_posts
        WHERE status = 'PUBLISHED'
          AND "deletedAt" IS NULL
      ) expanded
      WHERE keyword ILIKE ${`${prefix}%`}
      GROUP BY keyword
      ORDER BY count DESC, keyword
      LIMIT ${limit}
    `)

    return rowsOf<{ keyword: string }>(rows).map((s) => s.keyword)
  } catch (error) {
    logger.error(
      'Search suggestions error',
      error instanceof Error ? error : new Error(String(error))
    )
    return []
  }
}
