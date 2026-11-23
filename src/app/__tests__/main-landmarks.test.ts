// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for the skip link: every JSX `<main>` in src must be the
 * `#main-content` target and be programmatically focusable, and the root
 * layout must not render its own `<main>` (it would nest/duplicate).
 */
const SRC = join(process.cwd(), 'src')

function blank(match: string): string {
  return match.replace(/[^\n]/g, ' ')
}

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])(\/\/[^\n]*)/g, (_m, pre: string, c: string) => pre + blank(c))
}

/**
 * End of the opening tag that starts at `start`: the first `>` outside quotes and
 * outside `{...}` attribute expressions, so `onClick={() => x}` or
 * `className={a > b ? 'x' : 'y'}` no longer truncate the tag.
 */
function openingTagEnd(source: string, start: number): number {
  let depth = 0
  let quote = ''
  for (let i = start; i < source.length; i++) {
    const ch = source[i]
    if (quote) {
      if (ch === '\\') i++
      else if (ch === quote) quote = ''
    } else if (ch === '"' || ch === "'" || ch === '`') quote = ch
    else if (ch === '{') depth++
    else if (ch === '}') depth--
    else if (ch === '>' && depth === 0) return i + 1
  }
  return source.length
}

// `<main`, `<motion.main`, `<m.main`, `<Slot`-style wrappers are not detectable
// statically; the Playwright single-<main> check covers the rendered DOM.
function findMainTags(source: string): Array<{ line: number; tag: string }> {
  const clean = stripComments(source)
  const tags: Array<{ line: number; tag: string }> = []
  for (const m of clean.matchAll(/<(?:[A-Za-z_$][\w$]*\.)?main(?=[\s>/])/g)) {
    const start = m.index ?? 0
    const line = clean.slice(0, start).split('\n').length
    tags.push({ line, tag: clean.slice(start, openingTagEnd(clean, start)) })
  }
  return tags
}

function isCompliant(tag: string): boolean {
  return /\sid="main-content"/.test(tag) && /\stabIndex=\{-1\}/.test(tag)
}

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' ? [] : tsxFiles(full)
    }
    return full.endsWith('.tsx') ? [full] : []
  })
}

describe('main landmarks', () => {
  it('ignores comments but finds real main tags', () => {
    const commented = [
      '/**',
      ' * never overflow-hidden on <main>.',
      ' */',
      'const a = <div>{/* <main> */}</div>',
      'const u = "https://x.test"',
    ].join('\n')
    expect(findMainTags(commented)).toHaveLength(0)
    const real = 'const x = (\n  <main className="x">hi</main>\n)'
    const found = findMainTags(real)
    expect(found).toHaveLength(1)
    expect(found[0]?.line).toBe(2)
  })

  it('does not truncate tags at a > inside an attribute expression and sees motion.main', () => {
    const src =
      'const x = <main onClick={() => go()} className={a > b ? "x" : "y"} id="main-content" tabIndex={-1}>hi</main>\n' +
      'const y = <motion.main id="other">hi</motion.main>'
    const found = findMainTags(src)
    expect(found).toHaveLength(2)
    expect(isCompliant(found[0]?.tag ?? '')).toBe(true)
    expect(isCompliant(found[1]?.tag ?? '')).toBe(false)
  })

  it('every <main> in src has id="main-content" and tabIndex={-1}', () => {
    const offenders: string[] = []
    for (const file of tsxFiles(SRC)) {
      for (const { line, tag } of findMainTags(readFileSync(file, 'utf8'))) {
        if (!isCompliant(tag)) offenders.push(`${relative(SRC, file)}:${line}`)
      }
    }
    expect(offenders).toEqual([])
  })

  it('root layout renders no <main>', () => {
    const layout = readFileSync(join(SRC, 'app/layout.tsx'), 'utf8')
    expect(findMainTags(layout)).toHaveLength(0)
  })

  it('projects category filter trigger is named', () => {
    const src = readFileSync(
      join(SRC, 'app/projects/_components/projects-page-content.tsx'),
      'utf8'
    )
    const trigger = /<SelectTrigger(?=[\s>])[^>]*>/.exec(stripComments(src))
    expect(trigger?.[0]).toContain('aria-label="Filter by category"')
  })
})
