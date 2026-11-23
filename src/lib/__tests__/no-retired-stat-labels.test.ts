import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect } from 'vitest'

const FILES = [
  'src/components/layout/home-page-content.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/contact-client.tsx',
  'src/components/projects/project-stats.tsx',
  'src/components/projects/project-cta-section.tsx',
  'src/components/about/experience-stats.tsx',
]

const RETIRED = [
  'Revenue Generated',
  'Revenue Optimized',
  'Growth Delivered',
  'Growth Achieved',
  'Average Growth',
  'Network Expansion',
  "'Transaction Growth'",
  '"Transaction Growth"',
]

/**
 * Whitespace-collapsed so JSX text wrapped across lines still matches. Case is
 * kept: retired Title Case labels are banned, lowercase SEO prose is not a label.
 */
function findRetired(source: string): string[] {
  const flat = source.replace(/\s+/g, ' ')
  return RETIRED.filter((label) => flat.includes(label))
}

describe('findRetired detector', () => {
  it('catches wrapped lines and quoted variants', () => {
    expect(findRetired('<p>Revenue Generated</p>')).toEqual(['Revenue Generated'])
    expect(findRetired('<p>Revenue\n   Generated</p>')).toEqual(['Revenue Generated'])
    expect(findRetired("label: 'Transaction Growth'")).toEqual(["'Transaction Growth'"])
    expect(findRetired('label: "Transaction Growth"')).toEqual(['"Transaction Growth"'])
  })
  it('passes canonical copy', () => {
    expect(findRetired('<p>Revenue Impact</p>')).toEqual([])
  })
})

describe('retired stat labels', () => {
  for (const file of FILES) {
    it(`${file} has no retired label literal`, () => {
      const src = readFileSync(join(process.cwd(), file), 'utf8')
      expect(findRetired(src)).toEqual([])
    })
  }
})
