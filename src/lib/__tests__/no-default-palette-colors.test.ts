// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for the brand palette: components use the theme tokens (`bg-warning`,
 * `text-success`, `border-destructive`, ...), never Tailwind's default colour
 * scale (`bg-amber-500`, `text-red-600`, ...). The default scale is not part of
 * this site's navy / copper palette and renders as an off-brand saturated hue
 * (the scorecard's pillar bars were bright amber until this guard).
 */
const SRC = join(process.cwd(), 'src')
const SKIP_DIRS = new Set(['__tests__', 'emails', 'node_modules'])
const DEFAULT_SCALE =
  /\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|divide|shadow|accent|caret)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(full, out)
    } else if (/\.(ts|tsx)$/.test(name)) {
      out.push(full)
    }
  }
  return out
}

describe('brand palette', () => {
  it('no component uses a Tailwind default-scale colour class', () => {
    const offenders: string[] = []
    for (const file of walk(SRC)) {
      const matches = readFileSync(file, 'utf8').match(DEFAULT_SCALE)
      if (matches)
        offenders.push(`${relative(process.cwd(), file)}: ${[...new Set(matches)].join(', ')}`)
    }
    expect(offenders).toEqual([])
  })

  it('the pattern matches what it is meant to catch', () => {
    expect('bg-amber-500'.match(DEFAULT_SCALE)).toEqual(['bg-amber-500'])
    expect('text-red-600 hover:bg-sky-100'.match(DEFAULT_SCALE)).toHaveLength(2)
    expect('bg-warning text-success border-destructive'.match(DEFAULT_SCALE)).toBeNull()
  })
})
