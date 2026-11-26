/**
 * Author-bio detector shared by `schemas.ts` (which the contact form bundles
 * into the browser) and `blog-excerpt.ts`. Its only import is the import-free
 * entity decoder the resolvers also use; nothing else may be imported here,
 * because it would ship to every client that loads the schemas.
 */
import { decodeTextEntities } from '@/lib/text-entities'

const BOILERPLATE_SCAN_LENGTH = 400
const BIO_MENTION_SCAN = 160
const BIO_OPENER = /^I (spent|served|worked)\b.{0,80}\b(Army National Guard|National Guard|Iraq)\b/i
const BIO_MENTION = /Texas Army National Guard|deployment to Iraq/i
// Leading markup that can wrap the opener in raw text: emphasis, heading and
// quote markers, a link's '[', quotes, and any entity left after the single
// decode (`&amp;nbsp;` decodes to the literal `&nbsp;`). Dropped before the
// opener test so the schema (raw text) agrees with the excerpt resolvers
// (plain text) on entities, emphasis, headings, quotes and links. A bio hidden
// in a code span or behind a leading image is not caught here; the resolvers
// still discard the latter. Stripped locally: no markdown helper may be imported.
const LEADING_MARKUP = /^(?:&(?:#\d+|#x[\da-f]+|[a-z]+);|[^\p{L}])+/iu

/** True when the text is empty or opens with the author-bio boilerplate. */
export function isBioBoilerplate(text: string | null | undefined): boolean {
  const trimmed = (text ?? '').trim()
  if (trimmed === '') return true
  const head = trimmed.replace(LEADING_MARKUP, '').slice(0, BOILERPLATE_SCAN_LENGTH)
  if (BIO_OPENER.test(head)) return true
  return BIO_MENTION.test(head.slice(0, BIO_MENTION_SCAN))
}

/**
 * The schema's check on a raw stored meta. Entities are decoded once with the
 * resolvers' decoder, so `&#73; spent…` is judged as `I spent…` by both, and
 * `&amp;#73; spent…` (the literal text `&#73; spent…`) by neither. Text that
 * decodes to whitespace only (`&nbsp;`) is not a bio: the resolvers replace it
 * like a blank meta, and the schema must not reject it with the bio message.
 */
export function opensWithBio(raw: string): boolean {
  const decoded = decodeTextEntities(raw)
  return decoded.trim() !== '' && isBioBoilerplate(decoded)
}
