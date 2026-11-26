import { isBioBoilerplate } from '@/lib/bio-boilerplate'
import { decodeHtmlEntities } from '@/lib/markdown'

/**
 * Excerpt helpers for blog cards. Pure, so they run on the server page and
 * are unit-tested without a database. Output is always plain text.
 */

export const EXCERPT_MAX = 160
export const LEDE_MAX = 320
export const META_MAX = 160
const MIN_PARAGRAPH_LENGTH = 40

export { isBioBoilerplate }

const ESCAPE_OPEN = '\uE000'
const ESCAPE_CLOSE = '\uE001'

/** Strip inline markdown to plain text, decode entities, collapse whitespace. */
export function stripMarkdownToPlain(markdown: string): string {
  const stripped = markdown
    .replace(
      /\\([\\`*_{}[\]()#+\-.!])/g,
      (_m, ch: string) => `${ESCAPE_OPEN}${ch.charCodeAt(0)}${ESCAPE_CLOSE}`
    )
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/(^|[^\w])_([^_]+)_(?=$|[^\w])/g, '$1$2')
  const restored = stripped.replace(
    new RegExp(`${ESCAPE_OPEN}(\\d+)${ESCAPE_CLOSE}`, 'g'),
    (_m, code: string) => String.fromCharCode(Number(code))
  )
  return decodeHtmlEntities(restored).replace(/\s+/g, ' ').trim()
}

const FENCE_LINE = /^\s*(```|~~~)/
const NON_PROSE_START = /^(#|>|- |\* |\+ |\d+\. |\||!\[|<)/
const HORIZONTAL_RULE = /^([-*_])(\s*\1){2,}$/

const WHITESPACE = /\s/
const TRAILING_PUNCTUATION = /[,;:.…\-–—\s]+$/
// A terminator (plus an optional closing quote or bracket) that is followed by
// the start of a new sentence (capital, digit, opening quote or bracket) or by
// the end of the text. A lowercase continuation means it was not a sentence end.
const SENTENCE_END = /[.!?][”"’')\]]?(?=\s+[\p{Lu}\d“"‘'([]|\s*$)/gu
// Text ending in one of these is mid-sentence even before a capital ("Dr. Jones",
// "the U.S. Army", "e.g. Salesforce").
const ABBREVIATION = /\b(?:e\.g|i\.e|vs|etc|Mr|Mrs|Ms|Dr|St|U\.S|Inc|Jr|Sr)\.$/i
const INITIAL = /(?:^|[\s(])\p{Lu}\.$/u

function endsWithAbbreviation(text: string): boolean {
  return ABBREVIATION.test(text) || INITIAL.test(text)
}

const FINAL_TERMINATOR = /[.!?][”"’')\]]?$/

function endsWithSentence(text: string): boolean {
  const m = FINAL_TERMINATOR.exec(text)
  return m !== null && !endsWithAbbreviation(text.slice(0, m.index + 1))
}

/**
 * Locate the trailing run of ellipses: any mix of '…' and runs of three or more
 * '.', optionally separated by whitespace. Scans backwards once, so it is
 * linear in the input; a regex with `\.{3,}` nested in a repeated group
 * backtracks exponentially on a long dot run that is followed by more text.
 */
function trailingEllipsis(t: string): { start: number; hard: boolean; soft: boolean } {
  let start = t.length
  let hard = false
  let soft = false
  while (start > 0) {
    let j = start
    while (j > 0 && WHITESPACE.test(t[j - 1] as string)) j--
    if (j > 0 && t[j - 1] === '…') {
      soft = true
      start = j - 1
      continue
    }
    let k = j
    while (k > 0 && t[k - 1] === '.') k--
    if (j - k < 3) break
    hard = true
    start = k
  }
  return { start, hard, soft }
}

/**
 * Cut text to at most `max` characters. Prefers the last sentence end in the
 * second half of the window (no ellipsis); otherwise cuts at a word boundary
 * and appends exactly one '…'. A trailing ASCII '...' is the pipeline's hard
 * cut and may end mid-word, so its partial word is dropped; a stored '…' is an
 * author's ellipsis and is kept once. Output never contains '...'.
 */
export function truncateAtBoundary(text: string, max: number): string {
  let t = text.trim()
  const run = trailingEllipsis(t)
  const hardCut = run.hard
  const softEllipsis = !run.hard && run.soft
  t = t.slice(0, run.start).trimEnd()
  // Nothing but ellipses: there is no text to keep, so let the caller fall
  // back instead of emitting a lone '…'.
  if (t === '') return ''
  if (!hardCut && !softEllipsis && t.length <= max) return t
  if (softEllipsis && t.length <= max - 1) return `${t.replace(TRAILING_PUNCTUATION, '')}…`
  // A hard cut that lands just after a finished sentence cut nothing mid-word:
  // keep that sentence whole rather than dropping its last word.
  if (hardCut && t.length <= max && endsWithSentence(t)) return t

  const minEnd = Math.ceil(max / 2)
  let sentenceEnd = -1
  for (const m of t.matchAll(SENTENCE_END)) {
    const end = m.index + m[0].length
    if (end > max) break
    if (end >= minEnd && !endsWithAbbreviation(t.slice(0, m.index + 1))) sentenceEnd = end
  }
  if (sentenceEnd > 0) return t.slice(0, sentenceEnd)

  let head: string
  if (hardCut && t.length <= max - 1) {
    const lastSpace = t.lastIndexOf(' ')
    head = lastSpace > 0 ? t.slice(0, lastSpace) : t
  } else {
    const lastSpace = t.slice(0, max).lastIndexOf(' ')
    head = lastSpace > 0 ? t.slice(0, lastSpace) : t.slice(0, max - 1)
  }
  return `${head.replace(TRAILING_PUNCTUATION, '')}…`
}

function firstParagraph(content: string): string {
  let inFence = false
  for (const block of content.split(/\n\s*\n/)) {
    const fenceCount = block.split('\n').filter((line) => FENCE_LINE.test(line)).length
    if (inFence || fenceCount > 0) {
      if (fenceCount % 2 === 1) inFence = !inFence
      continue
    }
    const trimmed = block.trim()
    if (trimmed === '' || NON_PROSE_START.test(trimmed) || HORIZONTAL_RULE.test(trimmed)) continue
    const plain = stripMarkdownToPlain(trimmed)
    // Posts that carry the bio excerpt usually open their body with the same
    // bio paragraph, so it can never be the replacement.
    // A paragraph of nothing but ellipses has no text to show.
    if (
      plain.length >= MIN_PARAGRAPH_LENGTH &&
      !isBioBoilerplate(plain) &&
      trailingEllipsis(plain).start > 0
    )
      return plain
  }
  return ''
}

/**
 * Keep a real excerpt (normalised to plain text and truncated like a derived
 * one, so metadata never carries raw markdown or entities); replace boilerplate
 * or empty ones with the first real paragraph of the body, or '' when none
 * qualifies. `maxLength` defaults to EXCERPT_MAX (cards, feeds); the post-page
 * lede passes LEDE_MAX.
 */
export function resolveExcerpt(
  input: {
    excerpt: string | null | undefined
    content: string | null | undefined
  },
  opts: { maxLength?: number } = {}
): string {
  const max = opts.maxLength ?? EXCERPT_MAX
  if (!isBioBoilerplate(input.excerpt)) {
    const stored = stripMarkdownToPlain(input.excerpt as string)
    // A stored excerpt that is only markup (e.g. a lone image) or only an
    // ellipsis leaves nothing; fall through to the body like an empty one.
    const out = truncateAtBoundary(stored, max)
    if (out !== '') return out
  }
  return truncateAtBoundary(firstParagraph(input.content ?? ''), max)
}

/**
 * Meta description: the stored one when it is real (not bio, not blank),
 * as plain text within META_MAX; otherwise derived like an excerpt.
 */
export function resolveMetaDescription(input: {
  metaDescription: string | null | undefined
  excerpt: string | null | undefined
  content: string | null | undefined
}): string {
  if (!isBioBoilerplate(input.metaDescription)) {
    const out = truncateAtBoundary(stripMarkdownToPlain(input.metaDescription as string), META_MAX)
    if (out !== '') return out
  }
  return resolveExcerpt({ excerpt: input.excerpt, content: input.content }, { maxLength: META_MAX })
}
