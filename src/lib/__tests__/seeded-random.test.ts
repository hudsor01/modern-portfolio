// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createSeededRandom } from '../seeded-random'

describe('createSeededRandom', () => {
  it('is reproducible for the same seed', () => {
    const a = createSeededRandom('growth')
    const b = createSeededRandom('growth')
    for (let i = 0; i < 1000; i++) expect(a()).toBe(b())
  })

  it('differs across seeds', () => {
    const a = createSeededRandom('growth')
    const b = createSeededRandom('churn')
    const as = Array.from({ length: 10 }, () => a())
    const bs = Array.from({ length: 10 }, () => b())
    expect(as).not.toEqual(bs)
  })

  it('stays in [0, 1) and finite', () => {
    const r = createSeededRandom('range')
    for (let i = 0; i < 10_000; i++) {
      const v = r()
      expect(Number.isFinite(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('is well mixed (mean near 0.5)', () => {
    const r = createSeededRandom('mean')
    let sum = 0
    for (let i = 0; i < 10_000; i++) sum += r()
    const mean = sum / 10_000
    expect(mean).toBeGreaterThan(0.45)
    expect(mean).toBeLessThan(0.55)
  })
})
