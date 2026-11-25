import { describe, it, expect } from 'vitest'
import {
  computeCoverage,
  COVERAGE_PRESETS,
  amountInputError,
  caretAfterFormat,
  formatCount,
  formatGrouped,
  formatPercent,
  formatMoney,
  formatMultiple,
  MAX_AMOUNT,
  percentFieldError,
  sanitizeAmount,
  TARGET_REQUIRED_MESSAGE,
  targetFieldError,
  WIN_RATE_MAX_MESSAGE,
  WIN_RATE_POSITIVE_MESSAGE,
  WIN_RATE_REQUIRED_MESSAGE,
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

const NEG = 'Negative amounts are not allowed. Enter a positive number.'

describe('amountInputError', () => {
  it('accepts plain, grouped, $-prefixed, decimal and exactly-$10B amounts', () => {
    for (const ok of [
      '',
      '1000000',
      '1,000,000',
      '$2,000',
      ' 1 000 ',
      '1234.5',
      '1234.',
      '10000000000',
      '10,000,000,000',
      '$10,000,000,000.00',
    ]) {
      expect(amountInputError(ok, 'target')).toBeNull()
    }
  })

  it('any invalid character gives "Enter numbers only"', () => {
    for (const bad of ['abc-12,5e3x', '1e6', '1.5M', '+5']) {
      expect(amountInputError(bad, 'target')).toBe('Enter numbers only')
    }
    expect(amountInputError('1E6', 'amount')).toBe('Enter numbers only')
    expect(amountInputError('12abc', 'amount')).toBe('Enter numbers only')
  })

  it('a leading minus (hyphen or Unicode minus) gives its own message, different from letters', () => {
    for (const negative of ['-5', '−5', ' -5', '$-5', '-$5', '$ −1,000', '-0']) {
      expect(amountInputError(negative, 'target')).toBe(NEG)
    }
    expect(amountInputError('-5', 'target')).not.toBe(amountInputError('abc', 'target'))
  })

  it('a minus anywhere but the start is an invalid character, hyphen or Unicode', () => {
    for (const bad of ['5-3', '5-', '5−3', '--5', '-−5', '-5-', '1,000-']) {
      expect(amountInputError(bad, 'amount')).toBe('Enter numbers only')
    }
    // Invalid characters still win over a leading minus.
    expect(amountInputError('-abc', 'target')).toBe('Enter numbers only')
    expect(amountInputError('−1e6', 'target')).toBe('Enter numbers only')
  })

  it('flags a repeated decimal point', () => {
    expect(amountInputError('1.2.3', 'target')).toBe('Use a single decimal point.')
  })

  it('caps at $10B with a per-kind message', () => {
    expect(MAX_AMOUNT).toBe(10_000_000_000)
    expect(amountInputError('10000000001', 'target')).toBe('Enter a target up to $10B')
    expect(amountInputError('10000000000.5', 'target')).toBe('Enter a target up to $10B')
    expect(amountInputError('10000000001', 'amount')).toBe('Enter an amount up to $10B')
  })
})

describe('targetFieldError', () => {
  it('flags an empty or zero target as required', () => {
    expect(TARGET_REQUIRED_MESSAGE).toBe('Enter a revenue target greater than $0.')
    for (const empty of ['', '   ', '0', '0.00', '$0', '.']) {
      expect(targetFieldError(empty)).toBe(TARGET_REQUIRED_MESSAGE)
    }
    expect(computeCoverage({ revenueTarget: 0, winRatePct: 25 }).error).toBe(
      TARGET_REQUIRED_MESSAGE
    )
  })

  it('keeps the amountInputError precedence ahead of the required check', () => {
    expect(targetFieldError('abc')).toBe('Enter numbers only')
    expect(targetFieldError('-0')).toBe(NEG)
    expect(targetFieldError('0.0.0')).toBe('Use a single decimal point.')
    expect(targetFieldError('10000000001')).toBe('Enter a target up to $10B')
  })

  it('accepts a positive target', () => {
    expect(targetFieldError('0.5')).toBeNull()
    expect(targetFieldError('1,000,000')).toBeNull()
    expect(targetFieldError('10000000000')).toBeNull()
  })
})

describe('percentFieldError', () => {
  const fields = ['win', 'qualified', 'safety'] as const

  it('badInput is "Enter numbers only"; an empty optional field is fine', () => {
    for (const f of fields) {
      expect(percentFieldError('', true, f)).toBe('Enter numbers only')
      expect(percentFieldError('-5', false, f)).toBe(NEG)
    }
    expect(percentFieldError('', false, 'qualified')).toBeNull()
    expect(percentFieldError('', false, 'safety')).toBeNull()
  })

  it('an empty win rate is required', () => {
    expect(WIN_RATE_REQUIRED_MESSAGE).toBe('Enter a win rate.')
    expect(percentFieldError('', false, 'win')).toBe(WIN_RATE_REQUIRED_MESSAGE)
    expect(percentFieldError('  ', false, 'win')).toBe(WIN_RATE_REQUIRED_MESSAGE)
  })

  it('per-field range messages', () => {
    expect(percentFieldError('0', false, 'win')).toBe('Win rate must be greater than 0%.')
    expect(percentFieldError('150', false, 'win')).toBe('Win rate can’t exceed 100%.')
    expect(percentFieldError('150', false, 'qualified')).toBe('Enter a percentage up to 100%.')
    expect(percentFieldError('1001', false, 'safety')).toBe('Enter a margin up to 1,000%.')
  })

  it('accepts in-range values', () => {
    expect(percentFieldError('25', false, 'win')).toBeNull()
    expect(percentFieldError('100', false, 'qualified')).toBeNull()
    expect(percentFieldError('0', false, 'qualified')).toBeNull()
    expect(percentFieldError('1000', false, 'safety')).toBeNull()
    expect(percentFieldError('0', false, 'safety')).toBeNull()
  })
})

describe('win-rate messages', () => {
  it('computeCoverage and percentFieldError share one message per rule', () => {
    expect(computeCoverage({ revenueTarget: 1, winRatePct: 0 }).error).toBe(
      WIN_RATE_POSITIVE_MESSAGE
    )
    expect(percentFieldError('0', false, 'win')).toBe(WIN_RATE_POSITIVE_MESSAGE)
    expect(computeCoverage({ revenueTarget: 1, winRatePct: 101 }).error).toBe(WIN_RATE_MAX_MESSAGE)
    expect(percentFieldError('101', false, 'win')).toBe(WIN_RATE_MAX_MESSAGE)
    expect(WIN_RATE_POSITIVE_MESSAGE).toBe('Win rate must be greater than 0%.')
    expect(WIN_RATE_MAX_MESSAGE).toBe('Win rate can’t exceed 100%.')
  })
})

describe('field errors cover every invalid computation', () => {
  // Mirrors the calculator: a target with no field error is parsed with sanitizeAmount,
  // a win rate with no field error with Number. Whenever neither field reports an
  // error, computeCoverage must be valid, so the UI needs no "invalid result" branch.
  const targets = [
    '',
    ' ',
    '0',
    '0.00',
    '.',
    '$',
    '$0',
    '-5',
    '−5',
    '5-3',
    'abc',
    '1e6',
    '1.2.3',
    '0.5',
    '1',
    '$2,000',
    '1,000,000',
    '10000000000',
    '10000000001',
  ]
  const winRates = [
    '',
    ' ',
    '0',
    '-1',
    '0.0001',
    '1',
    '25',
    '1e1',
    '100',
    '100.5',
    '101',
    'Infinity',
  ]
  it.each(targets)('target "%s" across win rates', (t) => {
    for (const w of winRates) {
      const fieldsOk = targetFieldError(t) === null && percentFieldError(w, false, 'win') === null
      const result = computeCoverage({
        revenueTarget: Number(sanitizeAmount(t)),
        winRatePct: w.trim() === '' ? Number.NaN : Number(w),
      })
      if (fieldsOk) expect(result.valid, `${t} / ${w}`).toBe(true)
      if (!result.valid) expect(fieldsOk, `${t} / ${w}`).toBe(false)
    }
  })
})

describe('formatPercent', () => {
  it('normalizes the rate instead of echoing what was typed', () => {
    expect(formatPercent(Number('1e1'))).toBe('10%')
    expect(formatPercent(25)).toBe('25%')
    expect(formatPercent(33.33333)).toBe('33.33%')
    expect(formatPercent(100)).toBe('100%')
    expect(formatPercent(Number('025'))).toBe('25%')
  })

  it('keeps a sub-1% rate visible instead of rounding it to 0%', () => {
    expect(formatPercent(0.5)).toBe('0.5%')
    expect(formatPercent(0.0001)).toBe('0.0001%')
    expect(formatPercent(0.00012345)).toBe('0.00012%')
  })
})

describe('display formatters', () => {
  it('formatMoney bounds at $1T+', () => {
    expect(formatMoney(999_999)).toBe('$999,999')
    expect(formatMoney(4_000_000_000)).toBe('$4B')
    expect(formatMoney(25_000_000_000)).toBe('$25B')
    expect(formatMoney(1e12)).toBe('$1T+')
    expect(formatMoney(4e21)).toBe('$1T+')
  })

  it('formatMoney applies the ceiling to the rounded figure it prints', () => {
    expect(formatMoney(999_940_000_000)).toBe('$999.9B')
    expect(formatMoney(999_950_000_000)).toBe('$1T+')
    expect(formatMoney(999_960_000_000)).toBe('$1T+')
    // A $10B target at a 1.00004% win rate needs about $999.96B of pipeline.
    const r = computeCoverage({ revenueTarget: 10_000_000_000, winRatePct: 1.00004 })
    expect(r.requiredPipeline).toBeLessThan(1e12)
    expect(formatMoney(r.requiredPipeline)).toBe('$1T+')
  })

  it('formatMultiple bounds at 1,000×+', () => {
    expect(formatMultiple(4)).toBe('4.0×')
    expect(formatMultiple(999.94)).toBe('999.9×')
    expect(formatMultiple(999.96)).toBe('1,000×+')
    expect(formatMultiple(1000)).toBe('1,000×+')
    expect(formatMultiple(1e6)).toBe('1,000×+')
  })

  it('formatCount rounds up and bounds at 1,000,000,000+', () => {
    expect(formatCount(12.2)).toBe('13')
    expect(formatCount(1234)).toBe('1,234')
    expect(formatCount(2e9)).toBe('1,000,000,000+')
  })

  it('extreme inputs keep the math and bound the display', () => {
    const r = computeCoverage({ revenueTarget: 10_000_000_000, winRatePct: 0.0001 })
    expect(r.valid).toBe(true)
    expect(r.requiredPipeline).toBeCloseTo(1e16, -3)
    expect(formatMoney(r.requiredPipeline)).toBe('$1T+')
    expect(formatMultiple(r.requiredCoverage)).toBe('1,000×+')
  })

  it('never prints a runaway figure before the T', () => {
    for (const n of [1e9, 5e11, 9.99e11, 1e12, 4e15, 4e21]) {
      expect(formatMoney(n)).not.toMatch(/[\d,]{5,}T/)
    }
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
