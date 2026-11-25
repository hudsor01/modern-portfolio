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

  it('a shared lowest score is a tie: no weakest pillar, advice for the tied pillars only', () => {
    const r = scoreMaturity(byPillar({ process: 2, data: 2, technology: 5, alignment: 5 }))
    expect(r.weakestPillar).toBeNull()
    expect(r.weakestPillars).toEqual(['process', 'data'])
    expect(r.nextMove).toMatch(/tied/i)
    expect(r.nextMove).toContain('(Process and Data)')
    expect(r.nextMove).toMatch(/document the process/)
    expect(r.nextMove).toMatch(/clean the data/)
    expect(r.nextMove).not.toMatch(/consolidate|shared revenue number|Technology|Alignment/)
  })

  it('tie advice names only the tied pillars (Process 5, the rest 1)', () => {
    const r = scoreMaturity(byPillar({ process: 5, data: 1, technology: 1, alignment: 1 }))
    expect(r.weakestPillars).toEqual(['data', 'technology', 'alignment'])
    expect(r.weakestPillar).toBeNull()
    expect(r.nextMove).toContain('(Data, Technology and Alignment)')
    expect(r.nextMove).toMatch(/clean the data/)
    expect(r.nextMove).toMatch(/consolidate overlapping tools/)
    expect(r.nextMove).toMatch(/shared revenue number/)
    expect(r.nextMove).not.toMatch(/process/i)
  })

  it('all four pillars at 3 is a four-way tie', () => {
    const r = scoreMaturity(allAt(3))
    expect(r.weakestPillar).toBeNull()
    expect(r.weakestPillars).toEqual(PILLARS.map((p) => p.id))
    expect(r.nextMove).toMatch(/lowest pillars are tied/)
    expect(r.nextMove).toContain('(Process, Data, Technology and Alignment)')
  })

  it('a single weakest pillar is reported in weakestPillars', () => {
    const r = scoreMaturity(byPillar({ process: 4, data: 2, technology: 5, alignment: 3 }))
    expect(r.weakestPillars).toEqual(['data'])
    expect(r.weakestPillar).toBe('data')
    expect(r.nextMove).toMatch(/CRM hygiene|definitions/i)
  })

  it('a tie above the minimum does not matter: the single lowest still wins', () => {
    const r = scoreMaturity(byPillar({ process: 4, data: 4, technology: 4, alignment: 2 }))
    expect(r.weakestPillar).toBe('alignment')
  })

  it('pillars that differ by any real margin are not a tie', () => {
    const answers = allAt(3)
    answers.p1 = 4 // process mean 3.25, the rest 3.0 -> three-way tie at the lowest
    expect(scoreMaturity(answers).weakestPillar).toBeNull()
    answers.d1 = 4
    answers.t1 = 4
    answers.a1 = 2 // alignment 2.75 is now the unique lowest
    expect(scoreMaturity(answers).weakestPillar).toBe('alignment')
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
    expect(r.answeredByPillar).toEqual({ process: 0, data: 0, technology: 0, alignment: 0 })
    expect(r.everyPillarAnswered).toBe(false)
    expect(r.weakestPillars).toEqual([])
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

describe('scoreMaturity — answered gate and no benchmark claims', () => {
  it('one answer per pillar satisfies the gate', () => {
    const r = scoreMaturity({ p1: 3, d1: 3, t1: 3, a1: 3 })
    expect(r.answered).toBe(4)
    expect(r.valid).toBe(false)
    expect(r.everyPillarAnswered).toBe(true)
    expect(r.answeredByPillar).toEqual({ process: 1, data: 1, technology: 1, alignment: 1 })
  })

  it('three pillars answered does not satisfy the gate', () => {
    const r = scoreMaturity({ p1: 3, d1: 3, t1: 3 })
    expect(r.everyPillarAnswered).toBe(false)
  })

  it('reports no percentile and the tier-5 blurb makes no population claim', () => {
    expect('percentile' in scoreMaturity(allAt(3))).toBe(false)
    expect(TIERS[4]!.blurb).not.toMatch(/in 10 teams|teams operate here/)
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

describe('alignment blurb does not repeat its own statements (C-6)', () => {
  const grams = (t: string, n: number) => {
    const w = t
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
    return new Set(
      Array.from({ length: Math.max(0, w.length - n + 1) }, (_, i) => w.slice(i, i + n).join(' '))
    )
  }
  it.each(PILLARS.filter((p) => p.id === 'alignment').map((p) => [p.id, p] as const))(
    '%s blurb shares no 3-word run with its statements',
    (_id, pillar) => {
      const blurb = grams(pillar.blurb, 3)
      for (const q of QUESTIONS.filter((x) => x.pillar === pillar.id)) {
        for (const g of grams(q.text, 3)) expect(blurb.has(g), `"${g}" in ${q.id}`).toBe(false)
      }
    }
  )
})
