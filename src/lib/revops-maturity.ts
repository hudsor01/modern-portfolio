/**
 * Revenue Operations maturity scoring.
 *
 * A self-assessment across the four pillars that actually move RevOps maturity —
 * Process, Data, Technology, and Alignment — scored on a 1–5 scale per pillar and
 * rolled up to an overall maturity level (1 Ad-hoc → 5 Optimized). This is the
 * pure, side-effect-free core behind the RevOps Maturity Scorecard so it can be
 * unit-tested to the edges independent of the UI.
 *
 * Two opinions are baked in, both grounded in how RevOps maturity actually fails:
 *  1. Your weakest pillar is your ceiling — the highest-ROI next move is always
 *     the lowest-scoring pillar, not the one you most enjoy improving.
 *  2. Tooling maturity that runs ahead of data/process maturity is an
 *     anti-pattern ("buying tools you can't feed"), so we flag it explicitly.
 *
 * No Date/Math.random — fully deterministic for the same answers.
 */

export type PillarId = 'process' | 'data' | 'technology' | 'alignment'

export interface Pillar {
  id: PillarId
  label: string
  /** One-line description of what the pillar measures. */
  blurb: string
}

export interface Question {
  id: string
  pillar: PillarId
  /** A maturity statement the respondent rates 1 (not at all) → 5 (fully). */
  text: string
}

export interface Tier {
  level: number
  label: string
  /** Exclusive upper bound of the overall-score band; the top tier uses Infinity. */
  max: number
  blurb: string
}

export interface MaturityResult {
  /** True only when every question has a valid 1–5 answer. */
  valid: boolean
  answered: number
  total: number
  /** Mean 1–5 score per pillar; 0 for a pillar with no valid answers. */
  pillarScores: Record<PillarId, number>
  /** Mean of the pillars that have at least one answer; 0 if nothing answered. */
  overallScore: number
  /** Maturity level 1–5 derived from `overallScore` (0 if nothing answered). */
  level: number
  /** Human label for `level` ('Ad-hoc' … 'Optimized'); '' if nothing answered. */
  tier: string
  /** Lowest-scoring answered pillar — the highest-ROI place to invest next. */
  weakestPillar: PillarId | null
  /** The recommended next move, derived from `weakestPillar`. */
  nextMove: string
  /**
   * True when tooling maturity runs ≥1 full level ahead of the weaker of
   * data/process maturity — the "buying tools you can't feed" anti-pattern.
   */
  techOverbuy: boolean
  /** Directional percentile vs published B2B RevOps maturity benchmarks (1–99). */
  percentile: number
}

export const PILLARS: readonly Pillar[] = [
  {
    id: 'process',
    label: 'Process',
    blurb: 'Documented, repeatable revenue motions — stages, handoffs, forecasting.',
  },
  {
    id: 'data',
    label: 'Data',
    blurb: 'Clean, trusted, standardized data and a single source of truth.',
  },
  {
    id: 'technology',
    label: 'Technology',
    blurb: 'An integrated, right-sized stack that automates instead of adding friction.',
  },
  {
    id: 'alignment',
    label: 'Alignment',
    blurb: 'Sales, Marketing, and CS sharing goals, metrics, and a single revenue number.',
  },
] as const

export const QUESTIONS: readonly Question[] = [
  // Process
  {
    id: 'p1',
    pillar: 'process',
    text: 'Our sales stages have documented entry/exit criteria that reps actually follow.',
  },
  {
    id: 'p2',
    pillar: 'process',
    text: 'Lead routing and handoffs (MQL → SDR → AE → CS) are defined and enforced.',
  },
  {
    id: 'p3',
    pillar: 'process',
    text: 'We run a consistent forecast cadence with a repeatable methodology.',
  },
  {
    id: 'p4',
    pillar: 'process',
    text: 'Core revenue processes are documented, not tribal knowledge in a few heads.',
  },
  // Data
  {
    id: 'd1',
    pillar: 'data',
    text: 'Our CRM data is clean, deduplicated, and trusted for decisions.',
  },
  {
    id: 'd2',
    pillar: 'data',
    text: 'Key definitions (MQL, SQL, pipeline, ARR) are standardized across teams.',
  },
  {
    id: 'd3',
    pillar: 'data',
    text: 'We can attribute revenue to source and channel with confidence.',
  },
  {
    id: 'd4',
    pillar: 'data',
    text: 'Reporting comes from a single source of truth, not conflicting spreadsheets.',
  },
  // Technology
  {
    id: 't1',
    pillar: 'technology',
    text: 'Our GTM tools are integrated and data flows between them automatically.',
  },
  {
    id: 't2',
    pillar: 'technology',
    text: "We've eliminated redundant or overlapping tools and shadow systems.",
  },
  {
    id: 't3',
    pillar: 'technology',
    text: 'Reps spend minimal time on manual data entry and admin.',
  },
  {
    id: 't4',
    pillar: 'technology',
    text: 'We adopt new tools based on a real need and maturity fit, not hype.',
  },
  // Alignment
  {
    id: 'a1',
    pillar: 'alignment',
    text: 'Sales, Marketing, and CS share goals and a single revenue number.',
  },
  {
    id: 'a2',
    pillar: 'alignment',
    text: 'There is a clear owner (a RevOps function) for cross-team process and data.',
  },
  {
    id: 'a3',
    pillar: 'alignment',
    text: 'Comp plans reinforce the behaviors leadership actually wants.',
  },
  {
    id: 'a4',
    pillar: 'alignment',
    text: 'Leadership decisions run on the same metrics RevOps reports.',
  },
] as const

export const TIERS: readonly Tier[] = [
  {
    level: 1,
    label: 'Ad-hoc',
    max: 1.8,
    blurb:
      'Revenue runs on heroics and spreadsheets. Outcomes are unpredictable because the process is improvised every quarter.',
  },
  {
    level: 2,
    label: 'Emerging',
    max: 2.6,
    blurb:
      'Some process exists but it is inconsistent. Data and tools are partial, and teams still argue about the numbers.',
  },
  {
    level: 3,
    label: 'Defined',
    max: 3.4,
    blurb:
      'Core motions are documented and mostly followed. You have a working source of truth — now the gains come from consistency and integration.',
  },
  {
    level: 4,
    label: 'Managed',
    max: 4.2,
    blurb:
      'Process, data, and tools reinforce each other. You measure what matters and act on it — the focus shifts to optimization and prediction.',
  },
  {
    level: 5,
    label: 'Optimized',
    max: Number.POSITIVE_INFINITY,
    blurb:
      'RevOps is a strategic engine: clean data, automated workflows, aligned teams, and forecasting you trust. Fewer than ~1 in 10 teams operate here.',
  },
] as const

/** The highest-ROI next move for each pillar when it is the weakest link. */
const NEXT_MOVE: Record<PillarId, string> = {
  process:
    'Document your sales stages with explicit entry/exit criteria and lock in one forecast methodology — process gaps compound into every report and tool downstream. Fix this before you buy anything.',
  data: 'Clean up CRM hygiene and standardize your core definitions (MQL, SQL, pipeline, ARR) first. Every dashboard, attribution model, and AI feature you add inherits the quality of this data.',
  technology:
    'Consolidate overlapping tools and automate the manual handoffs eating your reps’ time — the highest return is removing friction from the stack you already own, not adding to it.',
  alignment:
    'Get Sales, Marketing, and CS onto one shared revenue number with a single owner for cross-team process. Misalignment quietly caps the return on every other improvement you make.',
}

/** Gap (in pillar levels) at which tech maturity outrunning data/process is flagged. */
const TECH_OVERBUY_GAP = 1.0

/**
 * Directional percentile anchors. Grounded in published B2B RevOps maturity
 * studies that put the median team around level 2.4/5 and only ~7% at level 5.
 * Monotonic; linearly interpolated between anchors. This is a positioning
 * estimate, not an audited sample — the UI labels it as such.
 */
const PERCENTILE_ANCHORS: ReadonlyArray<readonly [score: number, pct: number]> = [
  [1.0, 5],
  [2.0, 35],
  [2.4, 50],
  [3.0, 65],
  [3.4, 75],
  [4.0, 86],
  [4.5, 93],
  [5.0, 97],
]

function clampAnswer(v: number | undefined): number | undefined {
  if (typeof v !== 'number' || !Number.isFinite(v)) return undefined
  return Math.min(5, Math.max(1, v))
}

export function levelForScore(score: number): number {
  if (!Number.isFinite(score) || score <= 0) return 0
  for (const tier of TIERS) {
    if (score < tier.max) return tier.level
  }
  return TIERS[TIERS.length - 1]!.level
}

export function tierForScore(score: number): Tier | null {
  const level = levelForScore(score)
  return TIERS.find((t) => t.level === level) ?? null
}

function percentileForScore(score: number): number {
  if (!Number.isFinite(score) || score <= 0) return 0
  const first = PERCENTILE_ANCHORS[0]!
  const last = PERCENTILE_ANCHORS[PERCENTILE_ANCHORS.length - 1]!
  if (score <= first[0]) return first[1]
  if (score >= last[0]) return last[1]
  for (let i = 0; i < PERCENTILE_ANCHORS.length - 1; i++) {
    const [lowScore, lowPct] = PERCENTILE_ANCHORS[i]!
    const [highScore, highPct] = PERCENTILE_ANCHORS[i + 1]!
    if (score <= highScore) {
      const t = (score - lowScore) / (highScore - lowScore)
      return Math.round(lowPct + t * (highPct - lowPct))
    }
  }
  return last[1]
}

export function scoreMaturity(answers: Partial<Record<string, number>>): MaturityResult {
  const total = QUESTIONS.length

  // Group valid answers by pillar.
  const byPillar: Record<PillarId, number[]> = {
    process: [],
    data: [],
    technology: [],
    alignment: [],
  }
  let answered = 0
  for (const q of QUESTIONS) {
    const v = clampAnswer(answers[q.id])
    if (v !== undefined) {
      byPillar[q.pillar].push(v)
      answered++
    }
  }

  const mean = (xs: number[]): number =>
    xs.length === 0 ? 0 : xs.reduce((sum, x) => sum + x, 0) / xs.length

  const pillarScores: Record<PillarId, number> = {
    process: mean(byPillar.process),
    data: mean(byPillar.data),
    technology: mean(byPillar.technology),
    alignment: mean(byPillar.alignment),
  }

  // Overall = mean of pillars that actually have answers (so a partially
  // completed assessment isn't dragged down by empty pillars scored 0).
  const scored = PILLARS.map((p) => pillarScores[p.id]).filter((s) => s > 0)
  const overallScore = scored.length === 0 ? 0 : scored.reduce((a, b) => a + b, 0) / scored.length

  // Weakest answered pillar (ties resolve to canonical pillar order).
  let weakestPillar: PillarId | null = null
  let weakestScore = Number.POSITIVE_INFINITY
  for (const p of PILLARS) {
    const s = pillarScores[p.id]
    if (byPillar[p.id].length > 0 && s < weakestScore) {
      weakestScore = s
      weakestPillar = p.id
    }
  }

  // Anti-pattern: tech running ahead of the weaker of data/process. Only
  // meaningful when all three pillars have been answered.
  const techAnswered = byPillar.technology.length > 0
  const dataAnswered = byPillar.data.length > 0
  const processAnswered = byPillar.process.length > 0
  const techOverbuy =
    techAnswered &&
    dataAnswered &&
    processAnswered &&
    pillarScores.technology - Math.min(pillarScores.data, pillarScores.process) >= TECH_OVERBUY_GAP

  const tier = overallScore > 0 ? (tierForScore(overallScore)?.label ?? '') : ''

  return {
    valid: answered === total,
    answered,
    total,
    pillarScores,
    overallScore,
    level: levelForScore(overallScore),
    tier,
    weakestPillar,
    nextMove: weakestPillar ? NEXT_MOVE[weakestPillar] : '',
    techOverbuy,
    percentile: percentileForScore(overallScore),
  }
}
