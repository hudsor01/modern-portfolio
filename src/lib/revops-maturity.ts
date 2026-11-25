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
 *  1. Your weakest pillar is your ceiling — the next move targets the
 *     lowest-scoring pillar, not the one you most enjoy improving. Below the
 *     Managed band that move is foundational; in the Managed band it is a
 *     refinement; once even the lowest pillar scores in the Optimized band it
 *     is no longer a weakness, so no pillar is singled out.
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
  /**
   * Lowest-scoring answered pillar — the place to invest next.
   * Null when nothing is answered, when the lowest score is shared by more
   * than one pillar (a tie is not a finding), or when the lowest score is at or
   * above STRONG_PILLAR_SCORE (a pillar in the Optimized band is not a weakness).
   */
  weakestPillar: PillarId | null
  /**
   * The recommended next move, or '' until every pillar has an answer (a level
   * and its advice need all four pillars). When every pillar scores at or above
   * STRONG_PILLAR_SCORE, maintenance advice that singles out no pillar;
   * otherwise from `weakestPillar` (refine advice when it scores in the Managed
   * band, foundational advice below it); on a partial tie, advice composed only
   * from the tied pillars, in order of operations; when every pillar ties,
   * advice for an even profile that singles out no pillar.
   */
  nextMove: string
  /**
   * True when tooling maturity runs ≥1 full level ahead of the weaker of
   * data/process maturity — the "buying tools you can't feed" anti-pattern —
   * and that weaker foundation is still below the Managed band. A Managed
   * foundation can feed a stronger stack, so it is not flagged.
   */
  techOverbuy: boolean
  /** Valid answers per pillar. */
  answeredByPillar: Record<PillarId, number>
  /** True when every pillar has at least one valid answer — the gate for showing a level. */
  everyPillarAnswered: boolean
  /** All answered pillars sharing the lowest score, in PILLARS order; empty when nothing answered. */
  weakestPillars: PillarId[]
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
    blurb: 'Goals, metrics, and ownership shared across the teams that touch revenue.',
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
      'RevOps is a strategic engine: clean data, automated workflows, aligned teams, and forecasting you trust.',
  },
] as const

/** The next move for each pillar when it is the weakest link and scores below the Managed band. */
const NEXT_MOVE: Record<PillarId, string> = {
  process:
    'Document your sales stages with explicit entry/exit criteria and lock in one forecast methodology — process gaps compound into every report and tool downstream. Fix this before you buy anything.',
  data: 'Clean up CRM hygiene and standardize your core definitions (MQL, SQL, pipeline, ARR) first. Every dashboard, attribution model, and AI feature you add inherits the quality of this data.',
  technology:
    'Consolidate overlapping tools and automate the manual handoffs eating your reps’ time — the highest return is removing friction from the stack you already own, not adding to it.',
  alignment:
    'Get Sales, Marketing, and CS onto one shared revenue number with a single owner for cross-team process. Misalignment quietly caps the return on every other improvement you make.',
}

/**
 * The next move for each pillar when it is the weakest link but already scores in
 * the Managed band: the foundation is in place, so the advice refines it.
 */
const REFINE_MOVE: Record<PillarId, string> = {
  process:
    'Tighten stage exit criteria and audit them quarterly against won and lost deals, so the documented process stays the one reps actually follow.',
  data: 'Give your core definitions a named owner and audit duplicates and field drift on a regular schedule, so the source of truth stays trusted as the team and stack grow.',
  technology:
    'Review tool usage and integration errors on a regular schedule, retire what reps no longer use, and automate the handoffs that still need someone to re-key data.',
  alignment:
    'Review the shared revenue metrics in one recurring cross-team meeting, and check each comp cycle that incentives still reward the behaviors leadership wants.',
}

/** One clause per pillar, used to compose the next move when the lowest score is shared. */
const TIED_STEP: Record<PillarId, string> = {
  process:
    'document the process with explicit stage entry/exit criteria and one forecast methodology',
  data: 'clean the data and standardize your core definitions (MQL, SQL, pipeline, ARR)',
  technology: 'consolidate overlapping tools and automate the manual handoffs',
  alignment: 'get Sales, Marketing and CS onto one shared revenue number with a single owner',
}

/** One refine clause per pillar, for a shared lowest score in the Managed band. */
const TIED_REFINE_STEP: Record<PillarId, string> = {
  process: 'tighten stage exit criteria and audit them quarterly',
  data: 'give your core definitions a named owner and audit them on a schedule',
  technology: 'review tool usage and retire what reps no longer use',
  alignment: 'review the shared revenue metrics in one recurring cross-team meeting',
}

/** 'A', 'A and B', 'A, B and C'. */
function joinLabels(labels: string[]): string {
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}

/** Bottom and top of the 1–5 answer scale. */
const MIN_SCORE = 1
const MAX_SCORE = 5

/** Pillar means are sums of integers over 4; this only absorbs float noise. */
const TIE_EPSILON = 1e-9

/** The top tier (Optimized); its band starts where the tier below it ends. */
const TOP_TIER = TIERS[TIERS.length - 1]!

/** The Managed tier, one below the top. */
const MANAGED_TIER = TIERS[TIERS.length - 2]!

/**
 * Lower bound of the top (Optimized) tier. A pillar scoring at or above
 * it is not a weakness: it gets no remedial advice and no "weakest" badge.
 */
export const STRONG_PILLAR_SCORE = MANAGED_TIER.max

/**
 * Lower bound of the Managed tier. A weakest pillar scoring at or above it (and
 * below STRONG_PILLAR_SCORE) gets refine advice instead of foundational advice.
 */
export const MANAGED_PILLAR_SCORE = TIERS[TIERS.length - 3]!.max

/**
 * Next move when even the lowest pillar scores at or above STRONG_PILLAR_SCORE:
 * nothing is holding the others back, so the advice is to hold the line.
 */
function strongNextMove(weakestScore: number): string {
  const standing =
    weakestScore >= MAX_SCORE - TIE_EPSILON
      ? `Every pillar scores ${MAX_SCORE.toFixed(1)}, the top of the scale`
      : `Every pillar scores ${STRONG_PILLAR_SCORE.toFixed(1)} or higher, inside the ${TOP_TIER.label} band`
  return `${standing}, so there is no weak pillar to fix. Keep them there: retake the scorecard when your team, stack or go-to-market motion changes.`
}

/**
 * Next move when the lowest score is shared. If every pillar ties, none is
 * weaker than another, so the advice names no pillar as lowest.
 */
function tiedNextMove(ids: PillarId[], score: number): string {
  if (ids.length === PILLARS.length) {
    return `All four pillars score ${score.toFixed(1)}, so no single pillar is holding the others back. Raise them together rather than pushing one ahead of the rest.`
  }
  const labels = ids.map((id) => PILLARS.find((p) => p.id === id)!.label)
  const refine = isManagedBand(score)
  const steps = ids.map((id) => (refine ? TIED_REFINE_STEP[id] : TIED_STEP[id]))
  const sequence = steps.map((step, i) => (i === 0 ? `first ${step}` : `then ${step}`)).join(', ')
  return refine
    ? `Your lowest pillars are tied (${joinLabels(labels)}) and already in the ${MANAGED_TIER.label} band, so refine them in this order: ${sequence}.`
    : `Your lowest pillars are tied (${joinLabels(labels)}), so work in this order: ${sequence}.`
}

/** True for a pillar score in the Managed band: at or above its lower bound, below the Optimized band. */
function isManagedBand(score: number): boolean {
  return score >= MANAGED_PILLAR_SCORE - TIE_EPSILON && score < STRONG_PILLAR_SCORE - TIE_EPSILON
}

/** Gap (in pillar levels) at which tech maturity outrunning data/process is flagged. */
const TECH_OVERBUY_GAP = 1.0

function clampAnswer(v: number | undefined): number | undefined {
  if (typeof v !== 'number' || !Number.isFinite(v)) return undefined
  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, v))
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

  // Weakest answered pillar. A shared lowest score is a tie, not a finding,
  // and a lowest score in the Optimized band is not a weakness: in either case
  // no pillar is singled out (weakestPillar stays null).
  let weakestPillars: PillarId[] = []
  let weakestScore = Number.POSITIVE_INFINITY
  for (const p of PILLARS) {
    if (byPillar[p.id].length === 0) continue
    const s = pillarScores[p.id]
    if (s < weakestScore - TIE_EPSILON) {
      weakestScore = s
      weakestPillars = [p.id]
    } else if (Math.abs(s - weakestScore) <= TIE_EPSILON) {
      weakestPillars.push(p.id)
    }
  }
  const allStrong = weakestPillars.length > 0 && weakestScore >= STRONG_PILLAR_SCORE - TIE_EPSILON
  const weakestPillar: PillarId | null =
    !allStrong && weakestPillars.length === 1 ? weakestPillars[0]! : null
  const answeredPillars = PILLARS.filter((p) => byPillar[p.id].length > 0).length

  // Anti-pattern: tech running ahead of the weaker of data/process while that
  // foundation is below the Managed band. Only meaningful when all three
  // pillars have been answered.
  const techAnswered = byPillar.technology.length > 0
  const dataAnswered = byPillar.data.length > 0
  const processAnswered = byPillar.process.length > 0
  const foundation = Math.min(pillarScores.data, pillarScores.process)
  const techOverbuy =
    techAnswered &&
    dataAnswered &&
    processAnswered &&
    foundation < MANAGED_PILLAR_SCORE - TIE_EPSILON &&
    pillarScores.technology - foundation >= TECH_OVERBUY_GAP - TIE_EPSILON

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
    nextMove:
      answeredPillars !== PILLARS.length
        ? ''
        : allStrong
          ? strongNextMove(weakestScore)
          : weakestPillar
            ? isManagedBand(weakestScore)
              ? REFINE_MOVE[weakestPillar]
              : NEXT_MOVE[weakestPillar]
            : tiedNextMove(weakestPillars, weakestScore),
    techOverbuy,
    answeredByPillar: {
      process: byPillar.process.length,
      data: byPillar.data.length,
      technology: byPillar.technology.length,
      alignment: byPillar.alignment.length,
    },
    everyPillarAnswered: answeredPillars === PILLARS.length,
    weakestPillars,
  }
}
