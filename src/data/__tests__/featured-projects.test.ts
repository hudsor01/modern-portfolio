// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { showcaseProjects } from '../projects'
import { getFeaturedProjects } from '@/lib/projects'

/** Case studies that have no metadata.json. */
const SLUGS_WITHOUT_METADATA = ['partnership-program-implementation']

const EXPECTED_FEATURED = [
  'revenue-kpi',
  'forecast-pipeline-intelligence',
  'partnership-program-implementation',
  'sales-enablement',
]

function featuredSetErrors(slugsInOrder: string[]): string[] {
  const errors: string[] = []
  if (slugsInOrder.length !== EXPECTED_FEATURED.length) {
    errors.push(
      `expected ${EXPECTED_FEATURED.length} featured projects, found ${slugsInOrder.length}: ${slugsInOrder.join(', ')}`
    )
  }
  if (JSON.stringify(slugsInOrder) !== JSON.stringify(EXPECTED_FEATURED)) {
    errors.push(
      `featured order must be ${EXPECTED_FEATURED.join(', ')}; got ${slugsInOrder.join(', ')}`
    )
  }
  return errors
}

describe('featured detector', () => {
  it('rejects a 5-slug list', () => {
    expect(featuredSetErrors([...EXPECTED_FEATURED, 'deal-funnel']).length).toBeGreaterThan(0)
  })
  it('rejects a reordered list', () => {
    const reordered = [...EXPECTED_FEATURED].reverse()
    expect(featuredSetErrors(reordered).length).toBeGreaterThan(0)
  })
  it('accepts the expected list', () => {
    expect(featuredSetErrors([...EXPECTED_FEATURED])).toEqual([])
  })
})

describe('featured projects (single source: the flag)', () => {
  it('the featured flag marks exactly the four expected projects in order', () => {
    const slugs = showcaseProjects.filter((p) => p.featured).map((p) => p.slug)
    expect(featuredSetErrors(slugs)).toEqual([])
  })

  it('getFeaturedProjects() returns the expected four in order', async () => {
    const slugs = (await getFeaturedProjects()).map((p) => p.slug)
    expect(slugs).toEqual(EXPECTED_FEATURED)
  })

  it('the home page derives its set from getFeaturedProjects, not a slug list', () => {
    const src = readFileSync(join(process.cwd(), 'src/app/page.tsx'), 'utf8')
    expect(src).toContain('getFeaturedProjects(')
    expect(src).not.toContain('FEATURED_SLUGS')
  })

  it('no per-project metadata.json carries a featured key', () => {
    const root = join(process.cwd(), 'src/app/projects')
    const files = readdirSync(root, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => join(root, d.name, 'metadata.json'))
      .filter((f) => existsSync(f))
    // Every project carries one except the listed exceptions, so the scan cannot go vacuous.
    expect(files.length).toBe(showcaseProjects.length - SLUGS_WITHOUT_METADATA.length)
    const offenders = files.filter((f) =>
      Object.hasOwn(JSON.parse(readFileSync(f, 'utf8')), 'featured')
    )
    expect(offenders, `metadata.json files with a featured key: ${offenders.join(', ')}`).toEqual(
      []
    )
  })
})
