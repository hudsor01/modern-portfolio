/**
 * Author-bio detector used by the excerpt and meta resolvers
 * (`blog-excerpt.ts`), which hand it plain, entity-decoded text. Import-free.
 */

const BOILERPLATE_SCAN_LENGTH = 400
const BIO_MENTION_SCAN = 160
const BIO_OPENER = /^I (spent|served|worked)\b.{0,80}\b(Army National Guard|National Guard|Iraq)\b/i
const BIO_MENTION = /Texas Army National Guard|deployment to Iraq/i
// Leading non-letters (quotes, dashes, leftover markers) and any entity left
// after the resolvers' single decode (`&amp;nbsp;` decodes to the literal
// `&nbsp;`), dropped before the opener test so they cannot hide it.
const LEADING_MARKUP = /^(?:&(?:#\d+|#x[\da-f]+|[a-z]+);|[^\p{L}])+/iu

/** True when the text is empty or opens with the author-bio boilerplate. */
export function isBioBoilerplate(text: string | null | undefined): boolean {
  const trimmed = (text ?? '').trim()
  if (trimmed === '') return true
  const head = trimmed.replace(LEADING_MARKUP, '').slice(0, BOILERPLATE_SCAN_LENGTH)
  if (BIO_OPENER.test(head)) return true
  return BIO_MENTION.test(head.slice(0, BIO_MENTION_SCAN))
}
