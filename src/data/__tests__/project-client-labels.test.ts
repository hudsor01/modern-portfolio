// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { showcaseProjects } from '../projects'

const OLD_VALUES = [
  'TechCorp Inc.',
  'SaaS Growth Co.',
  'Enterprise Solutions',
  'Digital Marketing Agency',
  'SaaS Enterprise',
  'Tech Partnership Co.',
  'Enterprise SaaS',
  'Enterprise Sales Org',
  'Marketing Agency',
  'Channel Partner Program',
  'Tech Startup',
  'Enterprise Sales',
  'Enterprise Revenue Team',
  'Sales Organization',
]

function clientLabelErrors(value: string): string[] {
  const errors: string[] = []
  if (value.length === 0) errors.push('empty')
  if (value.length < 8 || value.length > 36) errors.push(`length ${value.length} outside 8-36`)
  const dots = value.split('·').length - 1
  if (dots > 1) errors.push('more than one separator')
  if (dots === 1 && !/^[^·]+ · [^·]+$/.test(value)) errors.push('separator must be " · "')
  if (value.length > 0 && value[0] !== value[0]?.toUpperCase()) errors.push('not capitalised')
  if (value.length > 0 && !/^[A-Z]/.test(value)) errors.push('must start with an uppercase letter')
  if (/\b(Inc|Co|LLC|Corp|Ltd)\b\.?/i.test(value)) errors.push('looks like a company name')
  if (OLD_VALUES.includes(value)) errors.push('old client value')
  return errors
}

describe('client label detector', () => {
  it('rejects company names, empties, over-separated and over-long values', () => {
    for (const bad of ['TechCorp Inc.', 'SaaS Growth Co.', '', 'A · B · C', 'x'.repeat(40)]) {
      expect(clientLabelErrors(bad).length, `"${bad}" should error`).toBeGreaterThan(0)
    }
  })
  it('rejects every old value', () => {
    for (const old of OLD_VALUES) {
      expect(clientLabelErrors(old), old).toContain('old client value')
    }
  })
  it('accepts descriptors', () => {
    expect(clientLabelErrors('Revenue reporting · 5 systems')).toEqual([])
    expect(clientLabelErrors('Partner commission operations')).toEqual([])
  })
})

describe('client labels', () => {
  it('checks exactly 14 projects', () => {
    expect(showcaseProjects).toHaveLength(14)
  })
  for (const p of showcaseProjects) {
    it(`client label: ${p.slug}`, () => {
      expect(clientLabelErrors(p.client).join(', '), `client "${p.client}"`).toBe('')
    })
  }
  it('all 14 labels are distinct', () => {
    const labels = showcaseProjects.map((p) => p.client)
    expect(new Set(labels).size).toBe(14)
  })
  it('no old value remains', () => {
    const left = showcaseProjects.filter((p) => OLD_VALUES.includes(p.client)).map((p) => p.client)
    expect(left).toEqual([])
  })
})
