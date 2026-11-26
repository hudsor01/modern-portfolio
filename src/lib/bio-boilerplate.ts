/**
 * Author-bio detector shared by `schemas.ts` (which the contact form bundles
 * into the browser) and `blog-excerpt.ts`. It must stay dependency-free: any
 * import here would ship to every client that loads the schemas.
 */

const BOILERPLATE_SCAN_LENGTH = 400
const BIO_MENTION_SCAN = 160
const BIO_OPENER = /^I (spent|served|worked)\b.{0,80}\b(Army National Guard|National Guard|Iraq)\b/i
const BIO_MENTION = /Texas Army National Guard|deployment to Iraq/i

/** True when the text is empty or opens with the author-bio boilerplate. */
export function isBioBoilerplate(text: string | null | undefined): boolean {
  const head = (text ?? '').trim().slice(0, BOILERPLATE_SCAN_LENGTH)
  if (head === '') return true
  if (BIO_OPENER.test(head)) return true
  return BIO_MENTION.test(head.slice(0, BIO_MENTION_SCAN))
}
