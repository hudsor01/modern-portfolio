// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatReads } from '../format-reads'

describe('formatReads', () => {
  it('pluralises and groups thousands', () => {
    expect(formatReads(0)).toBe('0 reads')
    expect(formatReads(1)).toBe('1 read')
    expect(formatReads(2)).toBe('2 reads')
    expect(formatReads(1234)).toBe('1,234 reads')
    expect(formatReads(1_000_000)).toBe('1,000,000 reads')
  })

  it('clamps invalid input to 0 and floors fractions', () => {
    expect(formatReads(-3)).toBe('0 reads')
    expect(formatReads(Number.NaN)).toBe('0 reads')
    expect(formatReads(1.7)).toBe('1 read')
  })
})
