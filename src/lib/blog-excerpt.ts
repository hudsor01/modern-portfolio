import { decodeHtmlEntities } from '@/lib/markdown'

/**
 * Excerpt helpers for blog cards. Pure, so they run on the server page and
 * are unit-tested without a database. Output is always plain text.
 */

const MAX_EXCERPT_LENGTH = 160
const MIN_PARAGRAPH_LENGTH = 40
const BOILERPLATE_SCAN_LENGTH = 400
const BIO_OPENER = /^I (spent|served|worked)\b.{0,80}\b(Army National Guard|National Guard)\b/i
const BIO_MENTION = /Texas Army National Guard/i

/** True when the excerpt is empty or opens with the author-bio boilerplate. */
export function isBioBoilerplate(excerpt: string | null | undefined): boolean {
  const text = (excerpt ?? '').trim().slice(0, BOILERPLATE_SCAN_LENGTH)
  if (text === '') return true
  if (BIO_OPENER.test(text)) return true
  return BIO_MENTION.test(text.slice(0, MAX_EXCERPT_LENGTH))
}

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

function truncate(text: string): string {
  if (text.length <= MAX_EXCERPT_LENGTH) return text
  const window = text.slice(0, MAX_EXCERPT_LENGTH + 1)
  const lastSpace = window.lastIndexOf(' ')
  const head = lastSpace > 0 ? window.slice(0, lastSpace) : text.slice(0, MAX_EXCERPT_LENGTH)
  return `${head.replace(/[,;:.\-–—\s]+$/, '')}…`
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
 * qualifies.
 */
export function resolveExcerpt(input: {
  excerpt: string | null | undefined
  content: string | null | undefined
}): string {
  if (!isBioBoilerplate(input.excerpt)) {
    const stored = stripMarkdownToPlain(input.excerpt as string)
    // A stored excerpt that is only markup (e.g. a lone image) strips to
    // nothing; fall through to the body like an empty one.
    if (stored !== '') return truncate(stored)
  }
  return truncate(firstParagraph(input.content ?? ''))
}
