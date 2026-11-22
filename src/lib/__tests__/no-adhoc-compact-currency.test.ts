// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for BUG-03: currency must be compacted by `formatCompactCurrency`
 * ("$1.3M", "$900K"), never by dividing and appending a unit by hand, which
 * produced "$3600K" on the revenue chart and "$1,276K" on the CLV page.
 * Count axes (customers, deals, touchpoints) are not currency and may still
 * scale by 1000 without a "$".
 */
const SRC = join(process.cwd(), 'src')

const FORBIDDEN: Array<{ name: string; pattern: RegExp }> = [
  {
    name: 'formatCurrency(x / 1000)}K',
    pattern: /formatCurrency\([^)]*\/\s*1_?000\s*\)\s*\}\s*K/,
  },
  {
    name: '$${(x / 1000[000]).toFixed(n)}K|M',
    pattern: /\$\$\{\s*\(?[^}]*\/\s*1_?000(?:_?000)?\s*\)?\.toFixed\(\d\)\s*\}\s*[KM]/,
  },
  {
    name: '$${expr.toFixed(n)}K|M|B in any form',
    pattern: /\$\$\{[^}]*\.toFixed\(\d\)[^}]*\}\s*[KMB]\b/,
  },
  {
    name: "'$' + expr.toFixed(n) + 'K|M|B'",
    pattern: /'\$'\s*\+[^;\n]*\.toFixed\(\d\)[^;\n]*\+\s*'[KMB]'/,
  },
  {
    name: 'a "$" string divided by 1e3 / 1e6 / 1e9',
    pattern: /\$[^\n]*\/\s*1e[369]\b|\/\s*1e[369]\b[^\n]*\$/,
  },
]

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' || entry === 'node_modules' ? [] : sourceFiles(full)
    }
    return /\.(ts|tsx)$/.test(entry) ? [full] : []
  })
}

describe('no ad-hoc compact currency formatting', () => {
  const files = sourceFiles(SRC)

  it('scans a non-trivial number of source files', () => {
    expect(files.length).toBeGreaterThan(100)
  })

  it.each(FORBIDDEN)('no source line matches $name', ({ pattern }) => {
    const offenders = files.flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .map((line, i) => ({ line, at: `${relative(SRC, file)}:${i + 1}` }))
        .filter(({ line }) => !line.trimStart().startsWith('//') && pattern.test(line))
        .map(({ at }) => at)
    )
    expect(offenders).toEqual([])
  })
})
