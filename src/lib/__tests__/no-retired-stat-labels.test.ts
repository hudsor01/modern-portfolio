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

describe('retired stat labels', () => {
  for (const file of FILES) {
    it(`${file} has no retired label literal`, () => {
      const src = readFileSync(join(process.cwd(), file), 'utf8')
      for (const label of RETIRED) expect(src, label).not.toContain(label)
    })
  }
})
