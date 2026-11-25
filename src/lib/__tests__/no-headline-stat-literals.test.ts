import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { NETWORK_GROWTH, REVENUE_IMPACT, TRANSACTION_GROWTH } from '@/lib/stats'

/**
 * Headline stats are typed once, in src/lib/stats.ts. Meta descriptions and
 * JSON-LD are included: an invisible copy still goes stale when a stat changes.
 */
const LITERALS = [REVENUE_IMPACT, TRANSACTION_GROWTH, NETWORK_GROWTH]

/** Files that may spell a figure out, and why. */
const ALLOWED: Record<string, string> = {
  'src/lib/stats.ts': 'the single source',
  // The write-up is the source the stat is drawn from (project copy rule).
  'src/app/projects/revenue-kpi/_components/NarrativeSections.tsx': 'case-study prose',
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sourceFiles(path)
    return /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

/** Drops // and block comments so explanatory notes may name a figure. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1')
}

function findLiterals(source: string): string[] {
  const code = stripComments(source)
  return LITERALS.filter((literal) => code.includes(literal))
}

describe('findLiterals detector', () => {
  it('catches a figure in a string and ignores comments', () => {
    expect(findLiterals(`const d = '${REVENUE_IMPACT} revenue impact'`)).toEqual([REVENUE_IMPACT])
    expect(findLiterals(`// e.g. "${TRANSACTION_GROWTH}"\nconst x = 1`)).toEqual([])
  })
})

describe('headline stat literals', () => {
  const root = process.cwd()
  const files = sourceFiles(join(root, 'src')).map((f) => relative(root, f))

  it('scans the source tree', () => {
    expect(files.length).toBeGreaterThan(100)
  })

  it('appear only in stats.ts and the allowed write-up', () => {
    const offenders = files
      .filter((file) => !(file in ALLOWED))
      .flatMap((file) =>
        findLiterals(readFileSync(join(root, file), 'utf8')).map((lit) => `${file}: ${lit}`)
      )
    expect(offenders).toEqual([])
  })

  it('allow-list entries still contain a figure', () => {
    for (const file of Object.keys(ALLOWED)) {
      const raw = readFileSync(join(root, file), 'utf8')
      expect(
        LITERALS.some((lit) => raw.includes(lit)),
        file
      ).toBe(true)
    }
  })
})
