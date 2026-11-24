// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const PROJECTS_DIR = join(process.cwd(), 'src/app/projects')

function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1
}

function firstGenMetaTitle(pageSrc: string): string | null {
  const start = pageSrc.indexOf('genMeta({')
  if (start === -1) return null
  const m = /title:\s*'((?:[^'\\]|\\.)*)'/.exec(pageSrc.slice(start))
  return m ? (m[1] as string) : null
}

function ogWiringErrors(slug: string, pageSrc: string, jsonLdSrc: string): string[] {
  const errors: string[] = []
  if (count(pageSrc, `ogProject: '${slug}'`) !== 1) {
    errors.push(`page.tsx must contain exactly one ogProject: '${slug}'`)
  }
  if (!jsonLdSrc.includes('ogImageUrl(')) errors.push('ProjectJsonLd file must call ogImageUrl(')
  if (!jsonLdSrc.includes(`project: '${slug}'`)) {
    errors.push(`ProjectJsonLd file must pass project: '${slug}'`)
  }
  const title = firstGenMetaTitle(pageSrc)
  if (title === null) errors.push('page.tsx has no genMeta title literal')
  else if (!jsonLdSrc.includes(`title: '${title}'`)) {
    errors.push(`ProjectJsonLd file must contain title: '${title}'`)
  }
  return errors
}

function slugDirs(): string[] {
  return readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== '[slug]')
    .filter((d) => existsSync(join(PROJECTS_DIR, d.name, 'page.tsx')))
    .map((d) => d.name)
    .sort()
}

function tsxFiles(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    if (name === '__tests__') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...tsxFiles(full))
    else if (name.endsWith('.tsx')) out.push(full)
  }
  return out
}

describe('og wiring detector', () => {
  const page = "genMeta({ title: 'My Title', ogProject: 'x', ogType: 'article' })"
  const jsonLd = "ogImageUrl({ title: 'My Title', project: 'x' })"
  it('accepts a conforming pair', () => {
    expect(ogWiringErrors('x', page, jsonLd)).toEqual([])
  })
  it('rejects a page without ogProject', () => {
    expect(
      ogWiringErrors('x', page.replace(", ogProject: 'x'", ''), jsonLd).length
    ).toBeGreaterThan(0)
  })
  it('rejects a JSON-LD file without project:', () => {
    expect(ogWiringErrors('x', page, "ogImageUrl({ title: 'My Title' })").length).toBeGreaterThan(0)
  })
  it('rejects a duplicated ogProject and a mismatched title', () => {
    expect(ogWiringErrors('x', `${page} ogProject: 'x'`, jsonLd).length).toBeGreaterThan(0)
    expect(
      ogWiringErrors('x', page, "ogImageUrl({ title: 'Other', project: 'x' })").length
    ).toBeGreaterThan(0)
  })
})

describe('og wiring (non-vacuity)', () => {
  it('discovers exactly 14 project slug dirs', () => {
    expect(slugDirs()).toHaveLength(14)
  })
})

for (const slug of slugDirs()) {
  describe(`og wiring: ${slug}`, () => {
    it('page and JSON-LD use the generated project card', () => {
      const dir = join(PROJECTS_DIR, slug)
      const pageSrc = readFileSync(join(dir, 'page.tsx'), 'utf8')
      const holders = tsxFiles(dir).filter((f) =>
        readFileSync(f, 'utf8').includes('<ProjectJsonLd')
      )
      expect(holders, `${slug}: exactly one file with <ProjectJsonLd`).toHaveLength(1)
      const jsonLdSrc = readFileSync(holders[0] as string, 'utf8')
      expect(ogWiringErrors(slug, pageSrc, jsonLdSrc).join('\n')).toBe('')
    })
  })
}

describe('generic [slug] page', () => {
  it('generic [slug] page uses the generated card', () => {
    const src = readFileSync(join(PROJECTS_DIR, '[slug]/page.tsx'), 'utf8')
    expect(src).toContain('project: slug')
    expect(src).not.toContain('safeFeaturedImageUrl')
  })
})
