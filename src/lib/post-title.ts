import { brandTitle, stripBrandSuffix } from '@/app/shared-metadata'

/**
 * Roughly what Google shows of a title before truncating (it measures pixels,
 * ~600px, which is about 60 characters of mixed-case text).
 */
export const TITLE_BUDGET = 60

/**
 * The `<title>` segment for a blog post; the root template appends the brand.
 *
 * The pipeline's `metaTitle` is preferred. When it plus " | Richard Hudson"
 * runs past the budget, the post's own title is used instead if its branded
 * form is shorter, so search results show a whole title rather than a cut one.
 * If neither fits, the SEO title stays (Google then trims the brand).
 */
export function postDocumentTitle(metaTitle: string | null | undefined, title: string): string {
  const plain = stripBrandSuffix(title)
  const seo = stripBrandSuffix(metaTitle || '') || plain || 'Blog'
  if (brandTitle(seo).length <= TITLE_BUDGET) return seo
  if (plain && brandTitle(plain).length < brandTitle(seo).length) return plain
  return seo
}

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
  if (kept.length === 0) return s.slice(0, max)
  while (kept.length > 1 && TRAILING_FILLER.has(kept[kept.length - 1]!.toLowerCase())) kept.pop()
  return kept.join(' ').replace(/[\s:;,.\-–—(&+]+$/, '') || s.slice(0, max)
}

/**
 * The SEO title (`metaTitle`) to store for a post, at most SEO_TITLE_MAX
 * characters, so `<title> | Richard Hudson` fits search results (see the
 * pipeline title spec). Applied by POST/PUT /api/blog, so whatever the
 * publishing pipeline sends is stored compliant and publishing never fails.
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
