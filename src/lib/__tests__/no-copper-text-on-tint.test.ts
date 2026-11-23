// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for A11Y-02: copper text (`text-accent` / `text-warning`) on a copper
 * tint (`bg-accent/N` / `bg-warning/N`) measures ~3.7:1. Use `text-warning-text`
 * (or `text-accent-text` where defined) on tints instead.
 */
const SRC = join(process.cwd(), 'src')

const LITERAL = /'[^'\n]*'|"[^"\n]*"|`[^`]*`/g
const TINT = /(?<![\w-])bg-(?:accent|warning)\/\d+/
const BARE_TEXT = /(?<![\w-])text-(?:accent|warning)(?![\w-])/

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
  it('never pairs bg-(accent|warning)/N with bare text-accent/text-warning', () => {
    const offenders: string[] = []
    for (const file of sourceFiles(SRC)) {
      const text = readFileSync(file, 'utf8')
      for (const match of text.matchAll(LITERAL)) {
        const literal = match[0]
        if (TINT.test(literal) && BARE_TEXT.test(literal)) {
          const line = text.slice(0, match.index).split('\n').length
          offenders.push(`${relative(process.cwd(), file)}:${line}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })
})
