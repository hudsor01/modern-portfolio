// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for A11Y-02: copper text (`text-accent` / `text-warning`) on a copper
 * tint (`bg-accent/N` / `bg-warning/N`) measures ~3.7:1. Use `text-warning-text`
 * (or `text-accent-text` where defined) on tints instead. Static check only:
 * classes assembled outside a className/cn() expression are not seen; the
 * Playwright axe gate is the runtime backstop.
 */
const SRC = join(process.cwd(), 'src')

const LITERAL = /'[^'\n]*'|"[^"\n]*"|`[^`]*`/g
// A class list is scoped to one `className=...` / `className: ...` value or one
// cn()/clsx()/cva()/twMerge() call, so classes split across several literals,
// conditionals and ternaries of the same expression are still seen together.
const REGION_START = /(?<![\w$])(?:className\s*[=:]\s*|(?:cn|clsx|cva|twMerge)\s*\()/g
const TINT = /(?<![\w-])bg-(?:accent|warning)\/\d+/
const BARE_TEXT = /(?<![\w-])text-(?:accent|warning)(?![\w-])/

function skipString(text: string, i: number): number {
  const quote = text[i]
  let j = i + 1
  while (j < text.length && text[j] !== quote) {
    if (text[j] === '\\') j++
    if (quote !== '`' && text[j] === '\n') return j
    j++
  }
  return j + 1
}

/** End index (exclusive) of the expression that starts at `start`. */
function regionEnd(text: string, start: number, openedParen: boolean): number {
  const first = text[start]
  if (!openedParen && (first === "'" || first === '"' || first === '`')) {
    return skipString(text, start)
  }
  let depth = openedParen ? 1 : 0
  let j = start
  if (!openedParen) {
    if (first !== '{') return start
    depth = 1
    j++
  }
  while (j < text.length && depth > 0) {
    const ch = text[j]
    if (ch === "'" || ch === '"' || ch === '`') {
      j = skipString(text, j)
      continue
    }
    if (ch === '{' || ch === '(') depth++
    else if (ch === '}' || ch === ')') depth--
    j++
  }
  return j
}

function classRegions(text: string): Array<{ index: number; literals: string }> {
  const out: Array<{ index: number; literals: string }> = []
  for (const m of text.matchAll(REGION_START)) {
    const start = (m.index ?? 0) + m[0].length
    const opened = m[0].trimEnd().endsWith('(')
    const end = regionEnd(text, start, opened)
    const region = text.slice(start, end)
    const literals = (region.match(LITERAL) ?? []).join(' ')
    out.push({ index: m.index ?? 0, literals })
  }
  return out
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' || entry === 'node_modules' ? [] : sourceFiles(full)
    }
    return /\.(ts|tsx)$/.test(entry) ? [full] : []
  })
}

describe('no copper text on copper tints', () => {
  it('sees classes split across literals of one className / cn() expression', () => {
    const split = classRegions(`const a = cn('bg-accent/10', cond && 'text-accent')`)
    expect(split).toHaveLength(1)
    expect(TINT.test(split[0]?.literals ?? '') && BARE_TEXT.test(split[0]?.literals ?? '')).toBe(
      true
    )
    const ternary = classRegions(
      `<a className={on ? 'bg-warning/10 p-2' : 'text-warning'}>Let's Talk</a>`
    )
    expect(ternary).toHaveLength(1)
    expect(
      TINT.test(ternary[0]?.literals ?? '') && BARE_TEXT.test(ternary[0]?.literals ?? '')
    ).toBe(true)
    const apart = classRegions(
      `<a className="bg-accent/10 text-accent-text">x</a><b className="text-accent">y</b>`
    )
    expect(apart.some((r) => TINT.test(r.literals) && BARE_TEXT.test(r.literals))).toBe(false)
  })

  it('never pairs bg-(accent|warning)/N with bare text-accent/text-warning', () => {
    const offenders: string[] = []
    for (const file of sourceFiles(SRC)) {
      const text = readFileSync(file, 'utf8')
      for (const { index, literals } of classRegions(text)) {
        if (TINT.test(literals) && BARE_TEXT.test(literals)) {
          const line = text.slice(0, index).split('\n').length
          offenders.push(`${relative(process.cwd(), file)}:${line}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })
})
