import { describe, it, expect } from 'vitest'
import {
  computeCoverage,
  COVERAGE_PRESETS,
  amountInputError,
  caretAfterFormat,
  formatGrouped,
  sanitizeAmount,
  type CoverageInput,
} from '@/lib/pipeline-coverage'

const base: CoverageInput = { revenueTarget: 1_000_000, winRatePct: 25 }

describe('computeCoverage — core math', () => {
  it('coverage = 1/winRate (25% → 4×, $1M → $4M pipeline)', () => {
    const r = computeCoverage(base)
    expect(r.valid).toBe(true)
    expect(r.requiredCoverage).toBeCloseTo(4, 6)
    expect(r.requiredPipeline).toBeCloseTo(4_000_000, 2)
    expect(r.winRate).toBeCloseTo(0.25, 6)
  })

  it('40% win → 2.5× (the generic 3× OVER-builds)', () => {
    const r = computeCoverage({ revenueTarget: 1_000_000, winRatePct: 40 })
    expect(r.requiredCoverage).toBeCloseTo(2.5, 6)
    expect(r.requiredPipeline).toBeCloseTo(2_500_000, 2)
    expect(r.vsLazyThreeX).toBeCloseTo(-500_000, 2) // negative = 3× over-builds
  })

  it('15% win → ~6.67× (the generic 3× UNDER-builds badly)', () => {
    const r = computeCoverage({ revenueTarget: 1_000_000, winRatePct: 15 })
    expect(r.requiredCoverage).toBeCloseTo(1 / 0.15, 6)
    expect(r.vsLazyThreeX).toBeGreaterThan(0) // positive = 3× under-builds
  })

  it('100% win → exactly 1× coverage', () => {
    const r = computeCoverage({ revenueTarget: 500_000, winRatePct: 100 })
    expect(r.requiredCoverage).toBeCloseTo(1, 6)
    expect(r.requiredPipeline).toBeCloseTo(500_000, 2)
  })

  it('safety margin multiplies coverage (10% buffer → 4.4×)', () => {
    const r = computeCoverage({ ...base, safetyMarginPct: 10 })
    expect(r.requiredCoverage).toBeCloseTo(4.4, 6)
    expect(r.requiredPipeline).toBeCloseTo(4_400_000, 2)
  })
})

describe('computeCoverage — deals & opps', () => {
  it('derives dealsToWin and oppsNeeded from avg deal size', () => {
    const r = computeCoverage({ ...base, avgDealSize: 50_000 })
    expect(r.dealsToWin).toBeCloseTo(20, 6) // 1M / 50k
    expect(r.oppsNeeded).toBeCloseTo(80, 6) // 20 / 0.25
  })

  it('omits deal/opp counts when avg deal size is missing or non-positive', () => {
    expect(computeCoverage(base).oppsNeeded).toBeUndefined()
    expect(computeCoverage({ ...base, avgDealSize: 0 }).oppsNeeded).toBeUndefined()
    expect(computeCoverage({ ...base, avgDealSize: -5 }).dealsToWin).toBeUndefined()
  })
})

describe('computeCoverage — current pipeline + qualified haircut', () => {
  it('computes shortfall gap against current pipeline', () => {
    const r = computeCoverage({ ...base, currentPipeline: 3_000_000 })
    expect(r.effectiveCurrentPipeline).toBeCloseTo(3_000_000, 2)
    expect(r.currentCoverage).toBeCloseTo(3, 6)
    expect(r.pipelineGap).toBeCloseTo(1_000_000, 2) // need 4M, have 3M → 1M short
  })

  it('qualified-rate haircut strips stalled pipeline from the effective total', () => {
    const r = computeCoverage({ ...base, currentPipeline: 3_000_000, qualifiedRatePct: 80 })
    expect(r.effectiveCurrentPipeline).toBeCloseTo(2_400_000, 2) // 3M × 0.8
    expect(r.pipelineGap).toBeCloseTo(1_600_000, 2) // need 4M, only 2.4M counts
  })

  it('reports a surplus (negative gap) when over-covered', () => {
    const r = computeCoverage({
      revenueTarget: 1_000_000,
      winRatePct: 25,
      currentPipeline: 5_000_000,
    })
    expect(r.pipelineGap).toBeCloseTo(-1_000_000, 2) // 4M needed, 5M have → 1M surplus
  })

  it('accepts a legitimate zero current pipeline (full gap)', () => {
    const r = computeCoverage({ ...base, currentPipeline: 0 })
    expect(r.effectiveCurrentPipeline).toBe(0)
    expect(r.pipelineGap).toBeCloseTo(4_000_000, 2)
  })
})

describe('computeCoverage — validation & adversarial inputs', () => {
  it('rejects non-positive revenue target', () => {
    expect(computeCoverage({ revenueTarget: 0, winRatePct: 25 }).valid).toBe(false)
    expect(computeCoverage({ revenueTarget: -100, winRatePct: 25 }).valid).toBe(false)
  })

  it('rejects win rate ≤ 0 or > 100', () => {
    expect(computeCoverage({ revenueTarget: 1_000_000, winRatePct: 0 }).valid).toBe(false)
    expect(computeCoverage({ revenueTarget: 1_000_000, winRatePct: -10 }).valid).toBe(false)
    expect(computeCoverage({ revenueTarget: 1_000_000, winRatePct: 120 }).valid).toBe(false)
  })

  it('never divides by zero or returns NaN/Infinity on valid inputs', () => {
    for (let w = 1; w <= 100; w++) {
      const r = computeCoverage({ revenueTarget: 1_000_000, winRatePct: w })
      expect(Number.isFinite(r.requiredCoverage)).toBe(true)
      expect(Number.isFinite(r.requiredPipeline)).toBe(true)
      expect(r.requiredPipeline).toBeGreaterThan(0)
    }
  })

  it('survives NaN / Infinity garbage without throwing or producing NaN output', () => {
    const garbage = computeCoverage({
      revenueTarget: Number.NaN,
      winRatePct: Number.POSITIVE_INFINITY,
      avgDealSize: Number.NaN,
      currentPipeline: Number.POSITIVE_INFINITY,
      qualifiedRatePct: Number.NaN,
      safetyMarginPct: Number.NaN,
    })
    expect(garbage.valid).toBe(false) // NaN target → invalid, no throw
  })

  it('clamps an out-of-range qualified rate instead of distorting the result', () => {
    const over = computeCoverage({ ...base, currentPipeline: 1_000_000, qualifiedRatePct: 150 })
    expect(over.effectiveCurrentPipeline).toBeCloseTo(1_000_000, 2) // clamped to 100%
    const under = computeCoverage({ ...base, currentPipeline: 1_000_000, qualifiedRatePct: -20 })
    expect(under.effectiveCurrentPipeline).toBe(0) // clamped to 0%
  })

  it('handles very large targets without overflow', () => {
    const r = computeCoverage({ revenueTarget: 5_000_000_000, winRatePct: 20 })
    expect(r.requiredPipeline).toBeCloseTo(25_000_000_000, 0)
    expect(Number.isFinite(r.requiredPipeline)).toBe(true)
  })
})

describe('COVERAGE_PRESETS', () => {
  it('every preset produces a valid result with sane coverage', () => {
    for (const p of COVERAGE_PRESETS) {
      const r = computeCoverage({ revenueTarget: 1_000_000, winRatePct: p.winRatePct })
      expect(r.valid).toBe(true)
      expect(r.requiredCoverage).toBeGreaterThan(1)
      expect(r.requiredCoverage).toBeLessThan(10)
    }
  })
})

describe('amount input formatting', () => {
  it('groups integer digits and keeps a typed decimal part', () => {
    expect(formatGrouped('1000000')).toBe('1,000,000')
    expect(formatGrouped('999')).toBe('999')
    expect(formatGrouped('')).toBe('')
    expect(formatGrouped('1234.5')).toBe('1,234.5')
    expect(formatGrouped('1234.')).toBe('1,234.')
  })

  it('sanitizeAmount drops commas, signs, letters and extra dots', () => {
    expect(sanitizeAmount('1,000,000')).toBe('1000000')
    expect(sanitizeAmount('-12abc')).toBe('12')
    expect(sanitizeAmount('1.2.3')).toBe('1.23')
  })
})

describe('amountInputError', () => {
  it('accepts plain, grouped, $-prefixed and decimal amounts', () => {
    for (const ok of ['', '1000000', '1,000,000', '$2,000', ' 1 000 ', '1234.5', '1234.']) {
      expect(amountInputError(ok)).toBeNull()
    }
  })

  it('rejects negatives, exponent notation, letters and extra dots with a message', () => {
    expect(amountInputError('-5')).toMatch(/negative/i)
    expect(amountInputError('1e6')).toMatch(/exponent/i)
    expect(amountInputError('1E6')).toMatch(/exponent/i)
    expect(amountInputError('1.5M')).toMatch(/digits only/i)
    expect(amountInputError('12abc')).toMatch(/digits only/i)
    expect(amountInputError('1.2.3')).toMatch(/decimal point/i)
  })
})

describe('caretAfterFormat', () => {
  it('keeps the caret after the same digit when a grouping comma appears', () => {
    // "1,000" with a 0 typed after the first digit: "1,0000" -> "10,000", caret after "10".
    expect(caretAfterFormat('1,0000', 3, '10,000')).toBe(2)
    // Typed at the end: stays at the end.
    expect(caretAfterFormat('1,0000', 6, '10,000')).toBe(6)
  })

  it('handles the start, decimals and an empty result', () => {
    expect(caretAfterFormat('1234', 0, '1,234')).toBe(0)
    expect(caretAfterFormat('1234.5', 6, '1,234.5')).toBe(7)
    expect(caretAfterFormat('', 0, '')).toBe(0)
  })
})
