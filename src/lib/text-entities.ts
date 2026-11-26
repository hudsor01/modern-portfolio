/**
 * The one HTML entity decoder for stored excerpts and metas, shared by the
 * excerpt resolvers (`blog-excerpt.ts`) and the schema's bio check
 * (`bio-boilerplate.ts`), so both judge the same characters. It must stay
 * import-free: `schemas.ts` reaches it through `bio-boilerplate.ts` and ships
 * to every client that loads the contact form.
 *
 * Not for the blog body: its code blocks use `decodeHtmlEntities` in
 * markdown.ts, which undoes exactly what `marked` escapes.
 */

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
 * surrogates, above U+10FFFF) are left as written.
 */
export function decodeTextEntities(text: string): string {
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
