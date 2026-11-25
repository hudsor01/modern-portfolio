// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for the A-9 card-in-card remainder: the deal-funnel charts render inside
 * `SectionCard`, which already supplies the border, radius and padding. Their own
 * root elements must stay flat; a bordered `bg-card` root (Velocity did) is a card in a
 * card, and `p-8` roots indent each chart's header 32px inside the section header.
 */
const DIR = join(process.cwd(), 'src/app/projects/deal-funnel/_components')

describe.each(['FunnelChart', 'ConversionChart', 'VelocityChart'])('%s root', (name) => {
  const src = readFileSync(join(DIR, `${name}.tsx`), 'utf8')
  const root = src.match(/return \(\s*<div([^>]*)>/)
  it('has a root element', () => {
    expect(root).not.toBeNull()
  })
  it('carries no border, background, padding or radius of its own', () => {
    const cls = root?.[1] ?? ''
    expect(cls).not.toMatch(/\b(?:border|bg-card|glass|rounded-\w+|p-\d+|px-\d+|py-\d+)\b/)
  })
})
