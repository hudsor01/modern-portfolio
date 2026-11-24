/** Displayed-copy extractor for project body components (not a test file). */
import { renderFormatters } from './sourcing'

/** Attribute / object keys whose values are layout, not copy. */
const LAYOUT_KEYS = new Set([
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'offset',
  'cx',
  'cy',
  'r',
  'x',
  'y',
  'x1',
  'x2',
  'y1',
  'y2',
  'top',
  'left',
  'right',
  'bottom',
  'opacity',
  'stopOpacity',
  'fillOpacity',
  'strokeOpacity',
  'strokeWidth',
  'strokeDasharray',
  'stroke',
  'fill',
  'stopColor',
  'className',
  'style',
  'viewBox',
  'transform',
  'padding',
  'margin',
  'gap',
  'flex',
  'inset',
  'size',
  'id',
  'key',
  'href',
  'src',
  'd',
  'points',
  'tickFormatter',
  'domain',
  'dataKey',
  'type',
  'variant',
  'color',
  'gradientTransform',
  'innerRadius',
  'outerRadius',
  'barSize',
  'aria-hidden',
  'role',
])

function stripComments(code: string): string {
  // Strings are scanned first so `//` inside "https://…" survives.
  let out = ''
  let i = 0
  while (i < code.length) {
    const ch = code[i] as string
    if (ch === "'" || ch === '"' || ch === '`') {
      let j = i + 1
      while (j < code.length && code[j] !== ch) {
        if (code[j] === '\\') j++
        j++
      }
      out += code.slice(i, j + 1)
      i = j + 1
    } else if (ch === '/' && code[i + 1] === '/') {
      while (i < code.length && code[i] !== '\n') i++
    } else if (ch === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2)
      i = end === -1 ? code.length : end + 2
      out += ' '
    } else {
      out += ch
      i++
    }
  }
  return out
}

function balanced(src: string, open: number, o: string, c: string): string {
  let depth = 0
  let quote: string | null = null
  for (let i = open; i < src.length; i++) {
    const ch = src[i] as string
    if (quote) {
      if (ch === '\\') i++
      else if (ch === quote) quote = null
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch
    else if (ch === o) depth++
    else if (ch === c && --depth === 0) return src.slice(open, i + 1)
  }
  return src.slice(open)
}

/** The identifier directly before `:` or `=` that introduces the literal at `at`, if any. */
function keyBefore(src: string, at: number): string | null {
  const m = /([A-Za-z_][\w-]*)\s*[:=]\s*\{?\s*$/.exec(src.slice(Math.max(0, at - 60), at))
  return m ? (m[1] as string) : null
}

/** Strings that are only CSS / Tailwind class soup, never prose. */
function isClassLike(lit: string): boolean {
  if (/^[\w\s:/[\].%#()-]+$/.test(lit) && !/[A-Z][a-z]/.test(lit.replace(/\[[^\]]*\]/g, ''))) {
    const toks = lit.trim().split(/\s+/)
    return toks.every((t) => /^[a-z0-9:[\]/.%#()-]+$/.test(t)) && /[-:[]/.test(lit)
  }
  return false
}

/** CSS values (lengths, functions, hex colours) are layout, not claims. */
function stripCss(text: string): string {
  return text
    .replace(
      /\b(?:blur|rgba?|hsla?|calc|translate[XYZ]?|rotate|scale|var|url|linear-gradient)\([^)]*\)/g,
      ' '
    )
    .replace(/\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw|deg|ms)\b/g, ' ')
    .replace(/#[0-9a-fA-F]{3,8}\b/g, ' ')
    .replace(/\b\d+(?:st|nd|rd|th)\b/g, ' ')
}

/**
 * The text a component DISPLAYS: JSX text nodes plus string/template-literal
 * statics, minus layout attributes, class strings and comments. Numeric literals
 * (generated chart data) never reach the output because only text is collected;
 * literal-argument formatter calls are rendered to the figure they print.
 */
export function bodyCopy(code: string): string {
  const src = stripComments(code)
  const pieces: string[] = []

  // 1. string / template literals
  let i = 0
  while (i < src.length) {
    const ch = src[i] as string
    const fm = /^format(?:Percentage|Trend|Number|Currency)\(/.exec(src.slice(i, i + 20))
    if (fm) {
      const call = balanced(src, i + fm[0].length - 1, '(', ')')
      const full = src.slice(i, i + fm[0].length - 1) + call
      const rendered = renderFormatters(full)
      if (rendered !== full) pieces.push(rendered)
      i += full.length
    } else if (ch === "'" || ch === '"' || ch === '`') {
      const key = keyBefore(src, i)
      let j = i + 1
      let lit = ''
      while (j < src.length && src[j] !== ch) {
        if (ch === '`' && src[j] === '$' && src[j + 1] === '{') {
          const inner = balanced(src, j + 1, '{', '}')
          lit += ` ${bodyCopy(inner.slice(1, -1))} `
          j += inner.length + 1
          continue
        }
        if (src[j] === '\\') j++
        lit += src[j]
        j++
      }
      const skip =
        (key !== null && LAYOUT_KEYS.has(key)) ||
        isClassLike(lit) ||
        /^data(?:Min|Max)\b/.test(lit) || // recharts axis domain expressions
        /^(?:use client|use server|@\/|\.{1,2}\/)/.test(lit) ||
        /^[\w-]+$/.test(lit) || // identifiers / enum values
        /^\d{4}-\d{2}-\d{2}(?:T[\d:.+Z-]*)?$/.test(lit) || // ISO timestamps
        /^(?:\d+|[0-9a-fA-F]{2}|0%|100%)$/.test(lit.trim()) // bare numbers, hex alpha, full/empty bars
      if (!skip) pieces.push(stripCss(lit))
      i = j + 1
    } else i++
  }

  // 2. JSX text nodes: text between a tag's `>` and the next `<`, expressions removed.
  for (const m of src.matchAll(/(?<![=-])>([^<>]+)</g)) {
    let t = m[1] as string
    let prev: string
    do {
      prev = t
      t = t.replace(/\{[^{}]*\}/g, ' ')
    } while (t !== prev)
    t = t.replace(/\s+/g, ' ').trim()
    if (/[A-Za-z0-9]/.test(t) && !/[;=?]|&&|\|\|/.test(t)) pieces.push(stripCss(t))
  }
  return pieces.join(' | ')
}
