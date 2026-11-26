import { brandTitle, stripBrandSuffix } from '@/app/shared-metadata'

/**
 * Roughly what Google shows of a title before truncating (it measures pixels,
 * ~600px, which is about 60 characters of mixed-case text).
 */
export const TITLE_BUDGET = 60

/** Characters a title can use before the brand suffix pushes it past the budget (43). */
export const SEO_TITLE_MAX = TITLE_BUDGET - (brandTitle('x').length - 1)

const TRAILING_FILLER = new Set([
  'a',
  'an',
  'and',
  'the',
  'to',
  'of',
  'for',
  'with',
  'in',
  'on',
  'or',
  'at',
  'by',
  'as',
  'vs',
  'from',
  'into',
  'is',
  'are',
  'your',
  'that',
  'why',
  'how',
  'what',
  'when',
  '&',
  '+',
  '-',
  '—',
  '–',
])

const GRAPHEMES = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/**
 * Longest prefix of whole user-perceived characters (grapheme clusters) at most
 * `max` UTF-16 units long, so a hard cut never splits a surrogate pair, an
 * emoji ZWJ sequence, a flag or a base letter from its combining mark. `max`
 * stays in UTF-16 units because that is what `.length` (and the budget) counts.
 * If not even the first cluster fits, falls back to whole code points.
 */
function graphemeCut(s: string, max: number): string {
  let end = 0
  for (const { segment, index } of GRAPHEMES.segment(s)) {
    if (index + segment.length > max) break
    end = index + segment.length
  }
  if (end > 0) return s.slice(0, end)
  for (const codePoint of s) {
    if (end + codePoint.length > max) break
    end += codePoint.length
  }
  return s.slice(0, end)
}

function tidy(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

/** Longest prefix of whole words within `max`, without dangling filler words or punctuation. */
function cutAtWord(s: string, max: number): string {
  const words = s.split(' ')
  const kept: string[] = []
  for (const w of words) {
    if ([...kept, w].join(' ').length > max) break
    kept.push(w)
  }
  // Only a single word longer than `max` leaves nothing whole to keep; that
  // one word is hard-cut, the only case where a word is ever split.
  if (kept.length === 0) return graphemeCut(s, max)
  while (kept.length > 1 && TRAILING_FILLER.has(kept[kept.length - 1]!.toLowerCase())) kept.pop()
  return kept.join(' ').replace(/[\s:;,.\-–—(&+]+$/, '') || graphemeCut(s, max)
}

/**
 * The SEO title (`metaTitle`) to store for a post, at most SEO_TITLE_MAX
 * characters, so `<title> | Richard Hudson` fits search results (see the
 * pipeline title spec). This is the single title rule: applied on write by
 * POST/PUT /api/blog (and categories) so whatever the publishing pipeline sends
 * is stored compliant, AND at read time for the post page <title>, og:title and
 * twitter:title so legacy stored values render compliant without a data migration.
 *
 * In order: the given SEO title if it fits; else the post title if it fits;
 * else the SEO title without a trailing "(…)"; else its part before ": "; else
 * a whole-word cut. A missing SEO title starts from the post title.
 */
export function normalizeSeoTitle(metaTitle: string | null | undefined, title: string): string {
  const max = SEO_TITLE_MAX
  const plain = tidy(stripBrandSuffix(title))
  const seo = tidy(stripBrandSuffix(metaTitle || '')) || plain
  if (seo.length <= max) return seo
  if (plain && plain.length <= max) return plain
  const noParen = tidy(seo.replace(/\s*\([^)]*\)\s*$/, ''))
  if (noParen && noParen.length <= max) return noParen
  const head = tidy(seo.split(': ')[0] ?? '')
  if (head.length >= 12 && head.length <= max) return head
  return cutAtWord(noParen || seo, max)
}
