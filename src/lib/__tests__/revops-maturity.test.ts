import { describe, it, expect } from 'vitest'
import {
  scoreMaturity,
  levelForScore,
  tierForScore,
  QUESTIONS,
  PILLARS,
  TIERS,
  STRONG_PILLAR_SCORE,
  MANAGED_PILLAR_SCORE,
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

describe('scoreMaturity — weakest pillar and its next move', () => {
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

  it('an even profile below the top names no pillar as lowest and advises raising them together', () => {
    for (const v of [1, 3, 4]) {
      const r = scoreMaturity(allAt(v))
      expect(r.weakestPillar).toBeNull()
      expect(r.weakestPillars).toEqual(PILLARS.map((p) => p.id))
      expect(r.nextMove).toBe(
        `All four pillars score ${v.toFixed(1)}, so no single pillar is holding the others back. Raise them together rather than pushing one ahead of the rest.`
      )
      expect(r.nextMove).not.toMatch(/lowest|tied|first|document the process|clean the data/i)
    }
  })

  it('all 5s gives no remedial advice: every pillar is at the top of the scale', () => {
    const r = scoreMaturity(allAt(5))
    expect(r.weakestPillar).toBeNull()
    expect(r.weakestPillars).toEqual(PILLARS.map((p) => p.id))
    expect(r.nextMove).toMatch(/top of the scale/)
    expect(r.nextMove).not.toMatch(
      /lowest|tied|raise|document the process|clean the data|consolidate|shared revenue number/i
    )
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

describe('scoreMaturity — a high profile has no weakest pillar', () => {
  const REMEDIAL =
    /lowest|tied|raise|before you buy|document (your sales stages|the process)|clean (up|the data)|consolidate|shared revenue number/i
  const MAINTAIN =
    'so there is no weak pillar to fix. Keep them there: retake the scorecard when your team, stack or go-to-market motion changes.'

  it('the strong-pillar threshold is the lower bound of the Optimized tier', () => {
    const optimized = TIERS[TIERS.length - 1]!
    expect(optimized.label).toBe('Optimized')
    expect(STRONG_PILLAR_SCORE).toBe(TIERS[TIERS.length - 2]!.max)
    expect(levelForScore(STRONG_PILLAR_SCORE)).toBe(optimized.level)
  })

  it('15 Fully + 1 Process Mostly: Optimized, no weakest pillar, no remedial advice', () => {
    const answers = allAt(5)
    answers.p1 = 4
    const r = scoreMaturity(answers)
    expect(r.pillarScores.process).toBeCloseTo(4.75, 6)
    expect(r.tier).toBe('Optimized')
    expect(r.weakestPillars).toEqual(['process'])
    expect(r.weakestPillar).toBeNull()
    expect(r.nextMove).toBe(
      `Every pillar scores ${STRONG_PILLAR_SCORE.toFixed(1)} or higher, inside the Optimized band, ${MAINTAIN}`
    )
    expect(r.nextMove).not.toMatch(REMEDIAL)
  })

  it('Process, Data and Technology at 4.75 with Alignment 5: no tied-pillar work order', () => {
    const answers = allAt(5)
    answers.p1 = 4
    answers.d1 = 4
    answers.t1 = 4
    const r = scoreMaturity(answers)
    expect(r.tier).toBe('Optimized')
    expect(r.weakestPillars).toEqual(['process', 'data', 'technology'])
    expect(r.weakestPillar).toBeNull()
    expect(r.nextMove).toContain(MAINTAIN)
    expect(r.nextMove).not.toMatch(REMEDIAL)
  })

  it('all 5s keeps the top-of-the-scale wording', () => {
    const r = scoreMaturity(allAt(5))
    expect(r.nextMove).toBe(`Every pillar scores 5.0, the top of the scale, ${MAINTAIN}`)
  })

  it('a lowest pillar exactly at the bound is not a weakness', () => {
    const r = scoreMaturity(
      byPillar({ process: STRONG_PILLAR_SCORE, data: 5, technology: 5, alignment: 5 })
    )
    expect(r.weakestPillars).toEqual(['process'])
    expect(r.weakestPillar).toBeNull()
    expect(r.nextMove).toContain(MAINTAIN)
    expect(r.nextMove).not.toMatch(REMEDIAL)
  })

  it('a lowest pillar just below the bound is still the weakest, with refine advice', () => {
    const r = scoreMaturity(
      byPillar({ process: STRONG_PILLAR_SCORE - 0.01, data: 5, technology: 5, alignment: 5 })
    )
    expect(r.weakestPillar).toBe('process')
    expect(r.nextMove).toBe(REFINE.process)
  })

  it('an even profile inside the Optimized band gets the maintenance advice, not "raise them together"', () => {
    const answers = allAt(5)
    for (const id of ['p1', 'd1', 't1', 'a1']) answers[id] = 4 // every pillar 4.75
    const r = scoreMaturity(answers)
    expect(r.weakestPillars).toEqual(PILLARS.map((p) => p.id))
    expect(r.weakestPillar).toBeNull()
    expect(r.nextMove).toContain(MAINTAIN)
    expect(r.nextMove).not.toMatch(REMEDIAL)
  })
})

const REFINE: Record<PillarId, string> = {
  process:
    'Tighten stage exit criteria and audit them quarterly against won and lost deals, so the documented process stays the one reps actually follow.',
  data: 'Give your core definitions a named owner and audit duplicates and field drift on a regular schedule, so the source of truth stays trusted as the team and stack grow.',
  technology:
    'Review tool usage and integration errors on a regular schedule, retire what reps no longer use, and automate the handoffs that still need someone to re-key data.',
  alignment:
    'Review the shared revenue metrics in one recurring cross-team meeting, and check each comp cycle that incentives still reward the behaviors leadership wants.',
}

/** Foundational (below-Managed) advice markers, one per pillar. */
const FOUNDATIONAL =
  /Document your sales stages|Clean up CRM hygiene|Consolidate overlapping tools|one shared revenue number|before you buy/

describe('scoreMaturity — refine advice for a weakest pillar in the Managed band', () => {
  it('the refine band is the Managed tier: from its lower bound up to the Optimized bound', () => {
    const managed = TIERS[TIERS.length - 2]!
    expect(managed.label).toBe('Managed')
    expect(MANAGED_PILLAR_SCORE).toBe(TIERS[TIERS.length - 3]!.max)
    expect(levelForScore(MANAGED_PILLAR_SCORE)).toBe(managed.level)
  })

  it('Process 4.0 and the rest 5: Process refine advice, not "Document your sales stages"', () => {
    const r = scoreMaturity(byPillar({ process: 4, data: 5, technology: 5, alignment: 5 }))
    expect(r.tier).toBe('Optimized')
    expect(r.weakestPillar).toBe('process')
    expect(r.nextMove).toBe(REFINE.process)
    expect(r.nextMove).not.toMatch(FOUNDATIONAL)
  })

  it.each(PILLARS.map((p) => [p.id] as const))(
    '%s at 4.0 with the rest 5 gets its own refine advice',
    (id) => {
      const values = { process: 5, data: 5, technology: 5, alignment: 5, [id]: 4 } as Record<
        PillarId,
        number
      >
      const r = scoreMaturity(byPillar(values))
      expect(r.weakestPillar).toBe(id)
      expect(r.nextMove).toBe(REFINE[id])
      expect(r.nextMove).not.toMatch(FOUNDATIONAL)
    }
  )

  it('refine advice applies whether or not the overall profile is Optimized', () => {
    const r = scoreMaturity(byPillar({ process: 4.5, data: 3.5, technology: 4, alignment: 4 }))
    expect(r.tier).toBe('Managed')
    expect(r.weakestPillar).toBe('data')
    expect(r.nextMove).toBe(REFINE.data)
  })

  it('exactly at the Managed lower bound is refine; just below it is foundational', () => {
    const at = scoreMaturity(
      byPillar({ process: 5, data: 5, technology: MANAGED_PILLAR_SCORE, alignment: 5 })
    )
    expect(at.weakestPillar).toBe('technology')
    expect(at.nextMove).toBe(REFINE.technology)
    const below = scoreMaturity(
      byPillar({ process: 5, data: 5, technology: MANAGED_PILLAR_SCORE - 0.01, alignment: 5 })
    )
    expect(below.weakestPillar).toBe('technology')
    expect(below.nextMove).toMatch(/Consolidate overlapping tools/)
  })

  it('just below the Optimized bound is refine; at it there is no weakest pillar', () => {
    const below = scoreMaturity(
      byPillar({ process: 5, data: 5, technology: 5, alignment: STRONG_PILLAR_SCORE - 0.01 })
    )
    expect(below.nextMove).toBe(REFINE.alignment)
    const at = scoreMaturity(
      byPillar({ process: 5, data: 5, technology: 5, alignment: STRONG_PILLAR_SCORE })
    )
    expect(at.weakestPillar).toBeNull()
    expect(at.nextMove).toMatch(/no weak pillar to fix/)
  })

  it('a partial tie in the Managed band composes refine steps for the tied pillars only', () => {
    const r = scoreMaturity(byPillar({ process: 4, data: 4, technology: 5, alignment: 5 }))
    expect(r.weakestPillar).toBeNull()
    expect(r.nextMove).toBe(
      'Your lowest pillars are tied (Process and Data) and already in the Managed band, so refine them in this order: first tighten stage exit criteria and audit them quarterly, then give your core definitions a named owner and audit them on a schedule.'
    )
    expect(r.nextMove).not.toMatch(/Technology|Alignment|document the process|clean the data/)
  })

  it('below the Managed band the foundational copy stays', () => {
    const r = scoreMaturity(byPillar({ process: 3, data: 5, technology: 5, alignment: 5 }))
    expect(r.weakestPillar).toBe('process')
    expect(r.nextMove).toMatch(/Document your sales stages/)
    const tie = scoreMaturity(byPillar({ process: 3, data: 3, technology: 5, alignment: 5 }))
    expect(tie.nextMove).toContain('so work in this order: first document the process')
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

  it('does not flag a stronger stack on a Managed-band foundation', () => {
    expect(
      scoreMaturity(byPillar({ process: 4, data: 5, technology: 5, alignment: 5 })).techOverbuy
    ).toBe(false)
    expect(
      scoreMaturity(
        byPillar({ process: MANAGED_PILLAR_SCORE, data: 5, technology: 5, alignment: 5 })
      ).techOverbuy
    ).toBe(false)
  })

  it('flags it once the foundation drops below the Managed band', () => {
    const r = scoreMaturity(
      byPillar({ process: MANAGED_PILLAR_SCORE - 0.01, data: 5, technology: 5, alignment: 5 })
    )
    expect(r.techOverbuy).toBe(true)
  })

  it('a gap of exactly one level counts despite float noise (thirds)', () => {
    // Three answers per pillar: Technology 13/3 (4.33) over Process 10/3 (3.33) is one level.
    const r = scoreMaturity({
      p1: 3,
      p2: 3,
      p3: 4,
      d1: 5,
      d2: 5,
      d3: 5,
      t1: 4,
      t2: 4,
      t3: 5,
      a1: 5,
      a2: 5,
      a3: 5,
    })
    expect(r.pillarScores.technology - r.pillarScores.process).toBeCloseTo(1, 9)
    expect(r.techOverbuy).toBe(true)
  })

  it('reports the overbuy foundation: the weaker pillar, both on a tie, none without overbuy', () => {
    expect(
      scoreMaturity(byPillar({ process: 2, data: 5, technology: 4, alignment: 3 }))
        .overbuyFoundation
    ).toEqual(['process'])
    expect(
      scoreMaturity(byPillar({ process: 5, data: 2, technology: 4, alignment: 3 }))
        .overbuyFoundation
    ).toEqual(['data'])
    expect(
      scoreMaturity(byPillar({ process: 2, data: 2, technology: 4, alignment: 3 }))
        .overbuyFoundation
    ).toEqual(['data', 'process'])
    expect(scoreMaturity(allAt(3)).overbuyFoundation).toEqual([])
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
    expect(r.weakestPillars).toEqual(['process']) // the only answered pillar
    expect(r.weakestPillar).toBeNull() // 5.0 is in the Optimized band: not a weakness
    expect(r.techOverbuy).toBe(false) // needs tech+data+process all answered
    expect(r.nextMove).toBe('') // no advice until every pillar has an answer
  })

  it('gives no next move until every pillar has an answer, then gives one', () => {
    expect(scoreMaturity({ p1: 5, d1: 5, t1: 5 }).nextMove).toBe('')
    expect(scoreMaturity({ p1: 1, d1: 5, t1: 5 }).nextMove).toBe('')
    expect(scoreMaturity({ p1: 5, d1: 5, t1: 5, a1: 5 }).nextMove).toMatch(/top of the scale/)
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
