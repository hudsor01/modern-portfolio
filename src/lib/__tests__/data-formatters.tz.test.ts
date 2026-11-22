// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatDate, getDisplayYearMonth } from '../data-formatters'

describe('formatDate timezone pinning', () => {
  it('runtime TZ matches process.env.TZ when set', () => {
    if (process.env.TZ) {
      expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(process.env.TZ)
    }
  })

  it('formats timestamps on the America/Chicago day', () => {
    expect(formatDate('2026-11-09T03:00:00Z', { month: 'long' })).toBe('November 8, 2026')
    expect(formatDate(new Date('2026-11-09T03:00:00Z'), { month: 'short' })).toBe('Nov 8, 2026')
  })

  it('keeps the calendar day of date-only strings', () => {
    expect(formatDate('2026-11-09', { month: 'long' })).toBe('November 9, 2026')
  })

  it('renders time in Chicago', () => {
    expect(formatDate('2026-11-09T18:30:00Z', { month: 'long', includeTime: true })).toContain(
      '12:30 PM'
    )
  })

  it('ignores a caller-supplied timeZone', () => {
    const opts = { month: 'long', timeZone: 'Asia/Tokyo' } as unknown as Parameters<
      typeof formatDate
    >[1]
    expect(formatDate('2026-11-09T03:00:00Z', opts)).toBe('November 8, 2026')
  })

  it('getDisplayYearMonth uses the Chicago calendar', () => {
    expect(getDisplayYearMonth(new Date('2026-10-01T03:00:00Z'))).toEqual({ year: 2026, month: 8 })
  })
})
