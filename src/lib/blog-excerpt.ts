import { isBioBoilerplate } from '@/lib/bio-boilerplate'

/**
 * Excerpt helpers for blog cards. Pure, so they run on the server page and
 * are unit-tested without a database. Output is always plain text.
 */

export const EXCERPT_MAX = 160
export const LEDE_MAX = 320
export const META_MAX = 160
const MIN_PARAGRAPH_LENGTH = 40

export { isBioBoilerplate }

/** Named entities that turn up in stored excerpts and metas. */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
}

/**
 * Decode numeric (decimal and hex) and common named HTML entities in one pass,
 * so a double-encoded value (`&amp;nbsp;`) is decoded once, to `&nbsp;`.
 * Unknown names and code points that are not valid characters (NUL, lone
 * surrogates, above U+10FFFF) are left as written. Excerpts only: the blog
 * body's code blocks use `decodeHtmlEntities` in markdown.ts, which undoes
 * exactly what `marked` escapes.
 */
function decodeTextEntities(text: string): string {
  return text.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (entity: string, body: string) => {
    if (body[0] !== '#') {
      // hasOwn, so a name like `constructor` is not looked up on the prototype.
      return (Object.hasOwn(NAMED_ENTITIES, body) && NAMED_ENTITIES[body]) || entity
    }
    const code =
      body[1] === 'x' || body[1] === 'X'
        ? Number.parseInt(body.slice(2), 16)
        : Number(body.slice(1))
    const valid = code > 0 && code <= 0x10ffff && (code < 0xd800 || code > 0xdfff)
    return valid ? String.fromCodePoint(code) : entity
  })
}

const ESCAPE_OPEN = '\uE000'
const ESCAPE_CLOSE = '\uE001'
const CODE_OPEN = '\uE002'
const CODE_CLOSE = '\uE003'
// Placeholder characters are removed from the input first, so every
// placeholder in the working text is one this function inserted.
const PLACEHOLDER_CHAR = /[\uE000-\uE003]/g
const ESCAPE_PLACEHOLDER = new RegExp(`${ESCAPE_OPEN}(\\d+)${ESCAPE_CLOSE}`, 'g')
const CODE_PLACEHOLDER = new RegExp(`${CODE_OPEN}(\\d+)${CODE_CLOSE}`)
const ESCAPABLE = new Set('\\`*_{}[]()#+-.!')

// Emphasis, CommonMark-style: an opening marker must be followed by a
// non-space and a closing marker preceded by one, so `2 * 3 * 4` and
// `a ** b` stay literal. `_` and `__` also never open or close inside a word,
// so `Stage__c`, `Forecast_Category__c` and `lead_source` stay literal.
// Each body stops at the next marker that could open or close (an intraword
// `_`/`__` can do neither, so it may sit inside), which keeps every rule linear:
// an opener never rescans the text past a marker that failed to close it.
const STRONG_STAR = /\*\*(?=\S)((?:(?!\*\*).)+?)(?<=\S)\*\*/g
const STRONG_UNDERSCORE =
  /(^|[^\p{L}\p{N}_])__(?=\S)((?:(?!__).|(?<=[\p{L}\p{N}])__(?=[\p{L}\p{N}]))+?)(?<=\S)__(?![\p{L}\p{N}_])/gu
const EM_STAR = /(?<!\*)\*(?=[^\s*])([^*]*?[^\s*])\*(?!\*)/g
const EM_UNDERSCORE =
  /(^|[^\p{L}\p{N}_])_(?=[^\s_])((?:[^_]|(?<=[\p{L}\p{N}])_(?=[\p{L}\p{N}]))*?[^\s_])_(?![\p{L}\p{N}_])/gu

/**
 * Replace backslash escapes and code spans with placeholders, scanning left to
 * right as CommonMark does: an escaped backtick opens nothing, and a backslash
 * inside a code span is literal. A code span is a run of N backticks closed by
 * the next run of exactly N; a run with no closer is literal text. Code span
 * contents are pushed to `codeSpans` and restored verbatim at the end.
 */
function protectLiterals(markdown: string, codeSpans: string[]): string {
  // Run lengths known to have no closer from some point on. Text only moves
  // forward, so a length with no closer stays closer-less, which keeps the
  // scan from re-searching the rest of the text for every unmatched run.
  const unclosed = new Set<number>()
  let out = ''
  let i = 0
  while (i < markdown.length) {
    const ch = markdown[i] as string
    const next = markdown[i + 1]
    if (ch === '\\' && next !== undefined && ESCAPABLE.has(next)) {
      out += `${ESCAPE_OPEN}${next.charCodeAt(0)}${ESCAPE_CLOSE}`
      i += 2
      continue
    }
    if (ch !== '`') {
      out += ch
      i++
      continue
    }
    let runEnd = i
    while (markdown[runEnd] === '`') runEnd++
    const length = runEnd - i
    const close = unclosed.has(length) ? -1 : closingRun(markdown, runEnd, length)
    if (close < 0) {
      unclosed.add(length)
      out += markdown.slice(i, runEnd)
      i = runEnd
      continue
    }
    out += `${CODE_OPEN}${codeSpans.push(markdown.slice(runEnd, close)) - 1}${CODE_CLOSE}`
    i = close + length
  }
  return out
}

/** Index of the next run of exactly `length` backticks at or after `from`, or -1. */
function closingRun(text: string, from: number, length: number): number {
  let start = text.indexOf('`', from)
  while (start >= 0) {
    let end = start
    while (text[end] === '`') end++
    if (end - start === length) return start
    start = text.indexOf('`', end)
  }
  return -1
}

/**
 * Strip inline markdown to plain text, decode entities, collapse whitespace.
 * Code span contents are kept verbatim (no emphasis stripping, no entity
 * decoding); only their backticks are dropped.
 */
export function stripMarkdownToPlain(markdown: string): string {
  const codeSpans: string[] = []
  const stripped = protectLiterals(markdown.replace(PLACEHOLDER_CHAR, ''), codeSpans)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(STRONG_STAR, '$1')
    .replace(STRONG_UNDERSCORE, '$1$2')
    .replace(EM_STAR, '$1')
    .replace(EM_UNDERSCORE, '$1$2')
    .replace(ESCAPE_PLACEHOLDER, (_m, code: string) => String.fromCharCode(Number(code)))
  // split() with a capture group puts each code span index at an odd position.
  // Decoding the text between spans separately means a decoded entity can
  // never be read back as a placeholder.
  const plain = stripped
    .split(CODE_PLACEHOLDER)
    .map((part, index) =>
      index % 2 === 0 ? decodeTextEntities(part) : (codeSpans[Number(part)] ?? '')
    )
    .join('')
  return plain.replace(/\s+/g, ' ').trim()
}

const FENCE_LINE = /^\s*(```|~~~)/
const NON_PROSE_START = /^(#|>|- |\* |\+ |\d+\. |\||!\[|<)/
const HORIZONTAL_RULE = /^([-*_])(\s*\1){2,}$/

const WHITESPACE = /\s/
const TRAILING_PUNCTUATION = /[,;:.…\-–—\s]+$/
const LETTER_OR_NUMBER = /[\p{L}\p{N}]/u

/** `head` without trailing punctuation, plus one '…'; '' when nothing is left. */
function withEllipsis(head: string): string {
  const body = head.replace(TRAILING_PUNCTUATION, '')
  return body === '' ? '' : `${body}…`
}
// A terminator (plus an optional closing quote or bracket) that is followed by
// the start of a new sentence (capital, digit, opening quote or bracket) or by
// the end of the text. A lowercase continuation means it was not a sentence end.
const SENTENCE_END = /[.!?][”"’')\]]?(?=\s+[\p{Lu}\d“"‘'([]|\s*$)/gu
// Text ending in one of these is mid-sentence even before a capital or a number
// ("Dr. Jones", "the U.S. Army", "e.g. Salesforce", "since Jan. 2024",
// "approx. 30%", "Fig. 3", "9 a.m. Eastern", "Gov. Abbott", "the avg. Deal").
// Titles, units and weekday forms that are not ordinary words. "Rep" is left
// out on purpose: "each rep. The…" is a routine sentence end on a sales blog.
const ABBREVIATION =
  /\b(?:e\.g|i\.e|a\.m|p\.m|vs|etc|approx|est|cf|fig|figs|vol|pp|ch|sec|avg|min|mins|max|hrs|Mr|Mrs|Ms|Dr|Prof|Sgt|Lt|Capt|Col|Gen|Gov|Sen|Rev|Dept|St|Ave|Blvd|Mt|Ft|U\.S|U\.K|Inc|Corp|Co|Ltd|Jr|Sr|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|Mon|Tue|Tues|Wed|Thu|Thur|Thurs|Fri)\.$/i
// "No."/"Nos." abbreviate "number" only before one ("ranks No. 1"). Before a
// word they are the word "no" ending a sentence ("The answer was no. Then…").
const NUMBER_ABBREVIATION = /\bnos?\.$/i
// What follows the terminator: a number, or nothing known (end of the text, or
// a cut that removed the continuation).
const NUMBER_OR_UNKNOWN_NEXT = /^\s*(?:\d|$)/
// Before a number, a period after any bare word of 1-4 letters is not trusted
// as a sentence end, listed or not ("the avg. 30%", "a min. 3", "Dept. 4",
// "2 hrs. 90%"): no fixed list can name every short abbreviation. "Q4. 2025",
// "in 2024. The" and longer words ("Morocco. 3") still end a sentence. A short
// word that really did end one ("every open deal. 30% of…") costs only a
// word-boundary cut with an ellipsis, never a false finished sentence.
const SHORT_WORD = /(?:^|[^\p{L}\p{N}])\p{L}{1,4}\.$/u
const DIGIT_NEXT = /^\s*\d/
const INITIAL = /(?:^|[\s(])\p{Lu}\.$/u

/**
 * True when `text` (which ends at a terminator) ends in an abbreviation rather
 * than a sentence. `rest` is the text after the terminator; '' means unknown.
 */
function endsWithAbbreviation(text: string, rest = ''): boolean {
  if (ABBREVIATION.test(text) || INITIAL.test(text)) return true
  if (DIGIT_NEXT.test(rest) && SHORT_WORD.test(text)) return true
  return NUMBER_ABBREVIATION.test(text) && NUMBER_OR_UNKNOWN_NEXT.test(rest)
}

/** `end`, moved back one unit if it would split a UTF-16 surrogate pair. */
function codePointCut(text: string, end: number): number {
  const code = text.charCodeAt(end - 1)
  return code >= 0xd800 && code <= 0xdbff ? end - 1 : end
}

const FINAL_TERMINATOR = /[.!?][”"’')\]]?$/
// A sentence that ends in an author's '...' (plus an optional closing quote or
// bracket): rendered as '…' at a cut, so no output ends in a run that reads as
// the pipeline's hard cut.
const FINAL_DOT_RUN = /\.{3,}([”"’')\]]?)$/

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
 * author's ellipsis and is kept once. Output never ends in '...'; a dot run
 * inside the kept text is the author's and is returned as written. Text with
 * no letter or number returns '' so callers can fall back.
 */
export function truncateAtBoundary(text: string, max: number): string {
  let t = text.trim()
  const run = trailingEllipsis(t)
  const hardCut = run.hard
  const softEllipsis = !run.hard && run.soft
  t = t.slice(0, run.start).trimEnd()
  // Nothing but ellipses, punctuation or dashes: there is no text to keep, so
  // let the caller fall back instead of emitting a lone '…' or '—'.
  if (!LETTER_OR_NUMBER.test(t)) return ''
  if (!hardCut && !softEllipsis && t.length <= max) return t
  if (softEllipsis && t.length <= max - 1) return withEllipsis(t)
  // A hard cut that lands just after a finished sentence cut nothing mid-word:
  // keep that sentence whole rather than dropping its last word.
  if (hardCut && t.length <= max && endsWithSentence(t)) return t

  const minEnd = Math.ceil(max / 2)
  let sentenceEnd = -1
  for (const m of t.matchAll(SENTENCE_END)) {
    const end = m.index + m[0].length
    if (end > max) break
    if (end >= minEnd && !endsWithAbbreviation(t.slice(0, m.index + 1), t.slice(end)))
      sentenceEnd = end
  }
  if (sentenceEnd > 0) return t.slice(0, sentenceEnd).replace(FINAL_DOT_RUN, '…$1')

  let head: string
  if (hardCut && t.length <= max - 1) {
    const lastSpace = t.lastIndexOf(' ')
    head = lastSpace > 0 ? t.slice(0, lastSpace) : t
  } else {
    const lastSpace = t.slice(0, max).lastIndexOf(' ')
    head = lastSpace > 0 ? t.slice(0, lastSpace) : t.slice(0, codePointCut(t, max - 1))
  }
  return withEllipsis(head)
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
    // A paragraph of nothing but ellipses, punctuation or dashes has no text to show.
    if (
      plain.length >= MIN_PARAGRAPH_LENGTH &&
      !isBioBoilerplate(plain) &&
      LETTER_OR_NUMBER.test(plain)
    )
      return plain
  }
  return ''
}

/**
 * Keep a real excerpt (normalised to plain text and truncated like a derived
 * one, so metadata never carries raw markdown, numeric entities or the common
 * named ones); replace boilerplate
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
  // Bio detection runs on the plain text, so markup or a leading entity
  // (`**I spent…**`, `&nbsp;I spent…`) cannot hide the opener.
  const stored = stripMarkdownToPlain(input.excerpt ?? '')
  if (!isBioBoilerplate(stored)) {
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
  const stored = stripMarkdownToPlain(input.metaDescription ?? '')
  if (!isBioBoilerplate(stored)) {
    const out = truncateAtBoundary(stored, META_MAX)
    if (out !== '') return out
  }
  return resolveExcerpt({ excerpt: input.excerpt, content: input.content }, { maxLength: META_MAX })
}
