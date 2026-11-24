// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for A-7: case-study prose is one size and one measure (`max-w-prose`, ~65
 * characters a line). A bare `<p>` gets the base paragraph rule (0.875rem, which is
 * 12.25px on this site's 14px root) while list items inherit the 14px body size, so
 * every paragraph names `text-base` to match its sibling lists.
 */
const PROJECTS = join(process.cwd(), 'src/app/projects')
const files = readdirSync(PROJECTS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => join(PROJECTS, d.name, '_components/NarrativeSections.tsx'))
  .filter((f) => {
    try {
      readFileSync(f)
      return true
    } catch {
      return false
    }
  })

describe('NarrativeSections typography', () => {
  it('finds the narrative files', () => {
    expect(files.length).toBeGreaterThanOrEqual(12)
  })

  for (const f of files) {
    const src = readFileSync(f, 'utf8')
    const name = f.slice(PROJECTS.length + 1)

    it(`${name}: bullet lists are not shrunk below body size`, () => {
      const bad = src.match(/<ul\b[^>]*list-inside[^>]*text-sm/g)
      expect(bad).toBeNull()
    })

    it(`${name}: paragraphs are body size, the same as the lists beside them`, () => {
      const tags = src.match(/<p\b[^>]*>/g) ?? []
      const small = tags.filter((t) => !/\btext-base\b/.test(t))
      expect(small).toEqual([])
    })

    it(`${name}: paragraphs and bullet lists cap their line length`, () => {
      const tags = src.match(/<p\b[^>]*>|<ul\b[^>]*list-inside[^>]*>/g) ?? []
      const uncapped = tags.filter((t) => !t.includes('max-w-prose'))
      expect(uncapped).toEqual([])
    })
  }
})
