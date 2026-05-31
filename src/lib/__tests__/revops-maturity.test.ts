import { describe, it, expect } from 'vitest'
import {
  scoreMaturity,
  levelForScore,
  tierForScore,
  QUESTIONS,
  PILLARS,
  TIERS,
  type PillarId,
} from '@/lib/revops-maturity'

/** Build an answer map setting every question to `v`. */
function allAt(v: number): Record<string, number> {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, v]))
}

/** Build an answer map with a per-pillar value. */
function byPillar(values: Record<PillarId, number>): Record<string, number> {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, values[q.pillar]]))
}

describe('scoreMaturity — overall scoring', () => {
  it('all 1s → level 1 Ad-hoc, score 1, valid', () => {
    const r = scoreMaturity(allAt(1))
    expect(r.valid).toBe(true)
    expect(r.answered).toBe(QUESTIONS.length)
    expect(r.overallScore).toBeCloseTo(1, 6)
    expect(r.level).toBe(1)
    expect(r.tier).toBe('Ad-hoc')
  })

  it('all 5s → level 5 Optimized, score 5', () => {
    const r = scoreMaturity(allAt(5))
    expect(r.overallScore).toBeCloseTo(5, 6)
    expect(r.level).toBe(5)
    expect(r.tier).toBe('Optimized')
    expect(r.percentile).toBe(97)
  })

  it('all 3s → level 3 Defined', () => {
    const r = scoreMaturity(allAt(3))
    expect(r.overallScore).toBeCloseTo(3, 6)
    expect(r.level).toBe(3)
    expect(r.tier).toBe('Defined')
  })

  it('per-pillar means roll up to the overall mean', () => {
    const r = scoreMaturity(byPillar({ process: 4, data: 2, technology: 3, alignment: 1 }))
    expect(r.pillarScores.process).toBeCloseTo(4, 6)
    expect(r.pillarScores.data).toBeCloseTo(2, 6)
    expect(r.pillarScores.technology).toBeCloseTo(3, 6)
    expect(r.pillarScores.alignment).toBeCloseTo(1, 6)
    expect(r.overallScore).toBeCloseTo((4 + 2 + 3 + 1) / 4, 6) // 2.5
    expect(r.level).toBe(2) // 2.5 < 2.6 → Emerging
  })
})

describe('scoreMaturity — weakest pillar (highest-ROI next move)', () => {
  it('identifies the single lowest-scoring pillar', () => {
    const r = scoreMaturity(byPillar({ process: 4, data: 2, technology: 5, alignment: 3 }))
    expect(r.weakestPillar).toBe('data')
    expect(r.nextMove).toMatch(/CRM hygiene|definitions/i)
  })

  it('ties resolve to canonical pillar order (process first)', () => {
    const r = scoreMaturity(byPillar({ process: 2, data: 2, technology: 5, alignment: 5 }))
    expect(r.weakestPillar).toBe('process')
  })

  it('alignment can be the weakest link', () => {
    const r = scoreMaturity(byPillar({ process: 5, data: 5, technology: 5, alignment: 1 }))
    expect(r.weakestPillar).toBe('alignment')
    expect(r.nextMove).toMatch(/Sales, Marketing/i)
  })
})

describe('scoreMaturity — tech-overbuy anti-pattern', () => {
  it('flags tech running a full level ahead of data/process', () => {
    const r = scoreMaturity(byPillar({ process: 2, data: 2, technology: 4, alignment: 3 }))
    expect(r.techOverbuy).toBe(true) // 4 - min(2,2) = 2 ≥ 1
  })

  it('does not flag when tech is in line with the foundation', () => {
    const r = scoreMaturity(byPillar({ process: 4, data: 4, technology: 4, alignment: 4 }))
    expect(r.techOverbuy).toBe(false)
  })

  it('does not flag when data/process exceed tech (healthy direction)', () => {
    const r = scoreMaturity(byPillar({ process: 5, data: 5, technology: 3, alignment: 4 }))
    expect(r.techOverbuy).toBe(false)
  })

  it('uses the WEAKER of data/process as the foundation', () => {
    // data high, process low → still overbuying relative to process
    const r = scoreMaturity(byPillar({ process: 2, data: 5, technology: 4, alignment: 3 }))
    expect(r.techOverbuy).toBe(true) // 4 - min(5,2)=2 ≥ 1
  })
})

describe('scoreMaturity — partial / adversarial input', () => {
  it('empty answers → not valid, zeroed, no weakest pillar', () => {
    const r = scoreMaturity({})
    expect(r.valid).toBe(false)
    expect(r.answered).toBe(0)
    expect(r.overallScore).toBe(0)
    expect(r.level).toBe(0)
    expect(r.tier).toBe('')
    expect(r.weakestPillar).toBeNull()
    expect(r.nextMove).toBe('')
    expect(r.percentile).toBe(0)
    expect(r.techOverbuy).toBe(false)
  })

  it('partial answers → not valid, but scores only the answered pillars', () => {
    // Only the process pillar answered (4 questions), all at 5.
    const answers = Object.fromEntries(
      QUESTIONS.filter((q) => q.pillar === 'process').map((q) => [q.id, 5])
    )
    const r = scoreMaturity(answers)
    expect(r.valid).toBe(false)
    expect(r.answered).toBe(4)
    expect(r.pillarScores.process).toBeCloseTo(5, 6)
    expect(r.pillarScores.data).toBe(0)
    expect(r.overallScore).toBeCloseTo(5, 6) // empty pillars excluded, not averaged as 0
    expect(r.weakestPillar).toBe('process')
    expect(r.techOverbuy).toBe(false) // needs tech+data+process all answered
  })

  it('clamps out-of-range numeric answers into [1,5]', () => {
    const r = scoreMaturity(allAt(99))
    expect(r.overallScore).toBeCloseTo(5, 6)
    const r0 = scoreMaturity(allAt(-10))
    expect(r0.overallScore).toBeCloseTo(1, 6)
  })

  it('ignores NaN / Infinity / non-number answers as unanswered', () => {
    const answers: Record<string, number> = allAt(4)
    answers.p1 = Number.NaN
    answers.d1 = Number.POSITIVE_INFINITY
    // @ts-expect-error — guarding against bad runtime input
    answers.t1 = 'four'
    const r = scoreMaturity(answers)
    expect(r.valid).toBe(false) // 3 questions dropped
    expect(r.answered).toBe(QUESTIONS.length - 3)
    // remaining process questions (p2-p4) still all 4
    expect(r.pillarScores.process).toBeCloseTo(4, 6)
  })
})

describe('levelForScore / tierForScore — band boundaries', () => {
  it('maps band edges to the right level', () => {
    expect(levelForScore(1.0)).toBe(1)
    expect(levelForScore(1.79)).toBe(1)
    expect(levelForScore(1.8)).toBe(2) // exclusive upper bound
    expect(levelForScore(2.59)).toBe(2)
    expect(levelForScore(2.6)).toBe(3)
    expect(levelForScore(3.39)).toBe(3)
    expect(levelForScore(3.4)).toBe(4)
    expect(levelForScore(4.19)).toBe(4)
    expect(levelForScore(4.2)).toBe(5)
    expect(levelForScore(5.0)).toBe(5)
  })

  it('returns 0 for non-positive / non-finite scores', () => {
    expect(levelForScore(0)).toBe(0)
    expect(levelForScore(-1)).toBe(0)
    expect(levelForScore(Number.NaN)).toBe(0)
  })

  it('tierForScore returns the matching tier object', () => {
    expect(tierForScore(2.4)?.label).toBe('Emerging')
    expect(tierForScore(5)?.label).toBe('Optimized')
  })
})

describe('percentile — directional benchmark', () => {
  it('median (2.4) ≈ 50th percentile', () => {
    const r = scoreMaturity(allAt(2.4))
    expect(r.percentile).toBe(50)
  })

  it('monotonically increases with score', () => {
    const p1 = scoreMaturity(allAt(1)).percentile
    const p3 = scoreMaturity(allAt(3)).percentile
    const p5 = scoreMaturity(allAt(5)).percentile
    expect(p1).toBeLessThan(p3)
    expect(p3).toBeLessThan(p5)
    expect(p1).toBeGreaterThanOrEqual(1)
    expect(p5).toBeLessThanOrEqual(99)
  })
})

describe('data integrity', () => {
  it('has 4 pillars and 16 questions, 4 per pillar', () => {
    expect(PILLARS).toHaveLength(4)
    expect(QUESTIONS).toHaveLength(16)
    for (const p of PILLARS) {
      expect(QUESTIONS.filter((q) => q.pillar === p.id)).toHaveLength(4)
    }
  })

  it('question ids are unique', () => {
    const ids = QUESTIONS.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('tiers are contiguous and ordered with an Infinity top band', () => {
    expect(TIERS).toHaveLength(5)
    expect(TIERS.map((t) => t.level)).toEqual([1, 2, 3, 4, 5])
    expect(TIERS[TIERS.length - 1]!.max).toBe(Number.POSITIVE_INFINITY)
  })
})
