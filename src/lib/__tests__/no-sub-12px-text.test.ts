// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for A11Y-02: no rendered text below 12px. The root is 14px, so rem/em
 * literals are multiplied by 14. Tests, emails (own renderer) and API routes
 * are skipped.
 */
const SRC = join(process.cwd(), 'src')
const ROOT_PX = 14
const MIN = 12

const SKIP_DIRS = new Set(['__tests__', 'emails', 'api', 'node_modules'])

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name) || (name === 'api' && !full.endsWith(join('app', 'api')))) {
        walk(full, out)
      }
    } else if (/\.(ts|tsx)$/.test(name)) {
      out.push(full)
    }
  }
  return out
}

const PATTERNS: Array<{ re: RegExp; px: (m: RegExpExecArray) => number }> = [
  { re: /text-\[(\d+(?:\.\d+)?)px\]/g, px: (m) => Number(m[1]) },
  { re: /text-\[(\d+(?:\.\d+)?)(?:rem|em)\]/g, px: (m) => Number(m[1]) * ROOT_PX },
  { re: /fontSize(?::\s*|=\{\s*)(\d+(?:\.\d+)?)\b(?!\s*\*)/g, px: (m) => Number(m[1]) },
  { re: /fontSize:\s*['"](\d+(?:\.\d+)?)px['"]/g, px: (m) => Number(m[1]) },
]

describe('no sub-12px text literals', () => {
  it('finds none in src', () => {
    const offenders: string[] = []
    for (const file of walk(SRC)) {
      const lines = readFileSync(file, 'utf8').split('\n')
      lines.forEach((line, i) => {
        for (const { re, px } of PATTERNS) {
          re.lastIndex = 0
          for (let m = re.exec(line); m; m = re.exec(line)) {
            if (px(m) < MIN) offenders.push(`${relative(process.cwd(), file)}:${i + 1}  ${m[0]}`)
          }
        }
      })
    }
    expect(offenders, `text below ${MIN}px:\n${offenders.join('\n')}`).toEqual([])
  })
})
