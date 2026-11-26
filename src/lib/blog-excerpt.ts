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

const TRAILING_ELLIPSIS = /(?:\s*(?:\.{3,}|…))+$/
const TRAILING_PUNCTUATION = /[,;:.…\-–—\s]+$/
const SENTENCE_END = /[.!?][”"’')\]]?(?=\s|$)/g

/**
 * Cut text to at most `max` characters. Prefers the last sentence end in the
 * second half of the window (no ellipsis); otherwise cuts at a word boundary
 * and appends exactly one '…'. A trailing ASCII '...' is the pipeline's hard
 * cut and may end mid-word, so its partial word is dropped; a stored '…' is an
 * author's ellipsis and is kept once. Output never contains '...'.
 */
export function truncateAtBoundary(text: string, max: number): string {
  let t = text.trim()
  let hardCut = false
  let softEllipsis = false
  const run = TRAILING_ELLIPSIS.exec(t)
  if (run) {
    if (run[0].includes('...')) hardCut = true
    else softEllipsis = true
    t = t.slice(0, run.index).trimEnd()
  }
  if (!hardCut && !softEllipsis && t.length <= max) return t
  if (softEllipsis && t.length <= max - 1) return `${t.replace(TRAILING_PUNCTUATION, '')}…`

  const window = t.slice(0, max + 1)
  const minEnd = Math.ceil(max / 2)
  let sentenceEnd = -1
  for (const m of window.matchAll(SENTENCE_END)) {
    const end = (m.index ?? 0) + m[0].length
    if (end <= max && end >= minEnd) sentenceEnd = end
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
    if (plain.length >= MIN_PARAGRAPH_LENGTH && !isBioBoilerplate(plain)) return plain
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
    // A stored excerpt that is only markup (e.g. a lone image) strips to
    // nothing; fall through to the body like an empty one.
    if (stored !== '') return truncateAtBoundary(stored, max)
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
    const plain = stripMarkdownToPlain(input.metaDescription as string)
    if (plain !== '') return truncateAtBoundary(plain, META_MAX)
  }
  return resolveExcerpt({ excerpt: input.excerpt, content: input.content }, { maxLength: META_MAX })
}
