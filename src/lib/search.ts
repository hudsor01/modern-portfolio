/**
 * Full-Text Search Utilities for PostgreSQL
 * Uses tsvector and trigram indexes for fast, typo-tolerant search.
 *
 * Backed by `blog_posts.search_vector` — a GENERATED ALWAYS tsvector column
 * (title weighted A, excerpt B, content C) with a GIN index, defined in
 * src/db/schema.ts and created by drizzle/migrations/0001_hard_maverick.sql.
 *
 * The typo-tolerant fallback below is deliberately NOT index-backed; see the
 * note in src/db/schema.ts for the EXPLAIN evidence behind that.
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
 * Shortest query the trigram fallback will run for.
 *
 * `word_similarity()` scores the query against the best-matching extent inside
 * the target, so a one- or two-character query scores highly against almost any
 * title: measured on the live corpus, `word_similarity('a', title) >= 0.45`
 * matches all 29 posts, and so does `'the'`. The fallback would then "helpfully"
 * return the entire blog for a single keystroke.
 *
 * This did not show before, only because the fallback was broken — the old `%`
 * operator matched nothing at all, so short queries produced nothing by
 * accident. Fixing the operator exposed it.
 *
 * Full-text is unaffected and still runs at any length; `plainto_tsquery` drops
 * stopwords on its own, which is why `'a'` and `'the'` yield an empty tsquery
 * and zero exact hits rather than noise.
 *
 * Length alone is not enough, though: `'the'` clears this bar at 3 characters
 * and still matched all 29 posts, and so would a real query like `'how to'`
 * (both words are stopwords). So the trigram branch ALSO requires
 * `plainto_tsquery(...) <> ''` — i.e. the query must contain at least one word
 * Postgres considers meaningful. That check rides along in the same statement,
 * so it costs no extra round trip.
 */
const MIN_TRIGRAM_QUERY_LENGTH = 3

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
    // Cache only a DEFINITIVE answer.
    pgTrgmAvailable = rowsOf(result).length > 0
    return pgTrgmAvailable
  } catch (error) {
    // A failed probe is not evidence the extension is missing — it is usually a
    // cold-start or transient connection error. Caching `false` here would
    // permanently downgrade a warm serverless instance to the ILIKE fallback
    // for the rest of its life, with no log to explain why. Degrade for this
    // request only, and leave the cache unset so the next call re-probes.
    logger.warn('pg_trgm probe failed; using ILIKE fallback for this request', {
      error: error instanceof Error ? error.message : String(error),
    })
    return false
  }
}

/** Test-only hook to reset the cached `pg_trgm` probe between cases. */
export function __resetPgTrgmCache(): void {
  pgTrgmAvailable = null
}

export async function searchBlogPosts(
  query: string,
  options: {
    limit?: number
    statusFilter?: string[]
  } = {}
): Promise<SearchResult[]> {
  // No `offset` / paging option, deliberately.
  //
  // There used to be one, and it was incorrect: the fuzzy fallback reused the
  // SAME offset the full-text query had already consumed, so page 2 skipped a
  // page of fuzzy hits and could repeat rows already shown. Nothing ever passed
  // it — the only caller is src/app/blog/page.tsx, which takes the top 50 — so
  // the bug was latent. Removing it beats shipping a paging API that silently
  // corrupts results; add it back only with per-phase offsets and a test.
  const { limit = 20, statusFilter } = options

  // Strip tsquery operators so user input can never be parsed as query syntax.
  // Terms are joined with a space, not ' & ': the target is plainto_tsquery,
  // which treats its whole argument as plain text and ANDs the terms itself —
  // an interleaved '&' is just a non-word token it discards. The old ' & ' join
  // implied an operator that was never honoured.
  //
  // This value must be what reaches SQL. It previously did not: every statement
  // interpolated the RAW `query` and `sanitizedQuery` was only read by the
  // emptiness guard below, so the sanitising this comment describes never
  // actually happened. (Injection was never possible — drizzle binds these as
  // parameters — but the trigram/ILIKE branches were matching against
  // punctuation the caller believed had been stripped.)
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

  // The PRIMARY query is deliberately OUTSIDE the try below.
  //
  // It used to be inside it, which meant any failure here — a cold-start
  // timeout, a dropped connection, future schema drift on search_vector — was
  // caught and turned into `[]`. Callers cannot distinguish that from "searched,
  // nothing matched": src/app/blog/page.tsx treats `[]` as a genuine empty
  // result and renders "No posts found", while its documented fallback to the
  // unfiltered index only fires on a throw. Because this function swallowed
  // everything, that fallback was unreachable and a broken search looked
  // exactly like an empty one. Letting this reject is what makes the
  // null-vs-empty contract in page.tsx real.
  const ftRows = await db.execute(sql`
    SELECT
      id,
      title,
      slug,
      excerpt,
      ts_rank(search_vector, plainto_tsquery('english', ${sanitizedQuery})) as rank,
      'exact' as "matchType"
    FROM blog_posts
    WHERE search_vector @@ plainto_tsquery('english', ${sanitizedQuery})
      ${statusCondition}
    ORDER BY rank DESC
    LIMIT ${limit}
  `)
  const fullTextResults = rowsOf<SearchResult>(ftRows)

  if (fullTextResults.length >= Math.min(limit, 5)) {
    return fullTextResults
  }

  // From here on, failures are genuinely non-fatal: we already have usable
  // full-text hits, so a broken fuzzy fallback should degrade to those rather
  // than fail the whole search.
  try {
    // Too-short queries are noise for trigram matching (see
    // MIN_TRIGRAM_QUERY_LENGTH); return whatever full-text found.
    const needsFuzzySearch =
      fullTextResults.length < Math.min(limit, 5) &&
      sanitizedQuery.length >= MIN_TRIGRAM_QUERY_LENGTH
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
            word_similarity(${sanitizedQuery}, title),
            word_similarity(${sanitizedQuery}, COALESCE(excerpt, ''))
          ) as rank,
          'fuzzy' as "matchType"
        FROM blog_posts
        WHERE plainto_tsquery('english', ${sanitizedQuery})::text <> ''
          AND GREATEST(
            word_similarity(${sanitizedQuery}, title),
            word_similarity(${sanitizedQuery}, COALESCE(excerpt, ''))
          ) >= ${TRIGRAM_MATCH_THRESHOLD}
          ${statusCondition}
          ${exclusion}
        ORDER BY rank DESC
        LIMIT ${fuzzyLimit}
      `)
    } else {
      // pg_trgm absent — fall back to a case-insensitive substring match so
      // search still degrades gracefully instead of returning only the
      // full-text hits. LIKE wildcards in the user's query are escaped so
      // they're treated literally. Title matches rank above excerpt matches.
      const likePattern = `%${sanitizedQuery.replace(/[\\%_]/g, '\\$&')}%`
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
      `)
    }
    const fuzzyResults = rowsOf<SearchResult>(fuzzyRows)

    return [...fullTextResults, ...fuzzyResults]
  } catch (error) {
    // Reached only by the fuzzy fallback now — the primary query is outside
    // this try — so the message is finally accurate.
    logger.error(
      'Search error during fuzzy fallback; returning full-text hits only',
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

  // Escape LIKE wildcards, same as the ILIKE fallback above. Without this a
  // prefix of `%` matches every keyword and `_` matches any character, so the
  // suggestions silently stop corresponding to what was typed.
  const safePrefix = prefix.replace(/[\\%_]/g, '\\$&')

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
      WHERE keyword ILIKE ${`${safePrefix}%`}
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
