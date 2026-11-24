/**
 * Win-rate-driven pipeline coverage math.
 *
 * The "3× pipeline" rule of thumb is wrong for most teams: required coverage is
 * a function of win rate, not a constant. A team that wins 40% of qualified
 * opps needs ~2.5× coverage; one that wins 15% needs ~6.7×. This module is the
 * pure, side-effect-free core behind the Pipeline Coverage Calculator so it can
 * be unit-tested to the edges independent of the UI.
 *
 *   required coverage  = (1 / winRate) × (1 + safetyMargin)
 *   required pipeline  = revenueTarget × required coverage
 */

export interface CoverageInput {
  /** Revenue target / quota for the period, in dollars. Required, > 0. */
  revenueTarget: number
  /** Expected win rate of qualified opportunities, 0–100. Required, > 0, ≤ 100. */
  winRatePct: number
  /** Average deal size in dollars. Optional — enables deal/opp counts. */
  avgDealSize?: number
  /** Open pipeline you have today, in dollars. Optional — enables the gap. */
  currentPipeline?: number
  /** % of `currentPipeline` that is genuinely active/qualified (strips stalled/zombie deals). Default 100. */
  qualifiedRatePct?: number
  /** Extra buffer for slippage/timing, as a %. Default 0. */
  safetyMarginPct?: number
}

export interface CoverageResult {
  valid: boolean
  /** Present only when `valid` is false. */
  error?: string
  /** Win rate as a decimal (0–1). */
  winRate: number
  /** Required coverage multiple (e.g. 4 means "4× your target in pipeline"). */
  requiredCoverage: number
  /** Required open pipeline in dollars to hit the target. */
  requiredPipeline: number
  /** currentPipeline × qualifiedRate — the pipeline that actually counts. */
  effectiveCurrentPipeline?: number
  /** effectiveCurrentPipeline ÷ target, as a multiple. */
  currentCoverage?: number
  /** requiredPipeline − effectiveCurrentPipeline. Positive = shortfall, negative = surplus. */
  pipelineGap?: number
  /** Deals you must win to hit target (target ÷ avgDealSize). */
  dealsToWin?: number
  /** Qualified opps you need in pipeline (dealsToWin ÷ winRate × safety). */
  oppsNeeded?: number
  /** What the generic "3× rule" would tell you to build. */
  lazyThreeXPipeline: number
  /** requiredPipeline − lazyThreeXPipeline. Positive = 3× under-builds; negative = 3× over-builds. */
  vsLazyThreeX: number
}

/** Finite positive number, else undefined. */
function pos(v: number | undefined): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : undefined
}

/** Clamp to [min, max]; non-finite falls back to `fallback`. */
function clamp(v: number | undefined, min: number, max: number, fallback: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) return fallback
  return Math.min(max, Math.max(min, v))
}

export function computeCoverage(input: CoverageInput): CoverageResult {
  const target = pos(input.revenueTarget)
  const winRatePct = input.winRatePct

  if (target === undefined) {
    return invalid('Enter a revenue target greater than $0.')
  }
  if (typeof winRatePct !== 'number' || !Number.isFinite(winRatePct) || winRatePct <= 0) {
    return invalid('Win rate must be greater than 0%.')
  }
  if (winRatePct > 100) {
    return invalid('Win rate can’t exceed 100%.')
  }

  const winRate = winRatePct / 100
  const safety = 1 + clamp(input.safetyMarginPct, 0, 1000, 0) / 100
  const qualifiedRate = clamp(input.qualifiedRatePct, 0, 100, 100) / 100

  const requiredCoverage = (1 / winRate) * safety
  const requiredPipeline = target * requiredCoverage
  const lazyThreeXPipeline = target * 3

  const result: CoverageResult = {
    valid: true,
    winRate,
    requiredCoverage,
    requiredPipeline,
    lazyThreeXPipeline,
    vsLazyThreeX: requiredPipeline - lazyThreeXPipeline,
  }

  const avgDeal = pos(input.avgDealSize)
  if (avgDeal !== undefined) {
    result.dealsToWin = target / avgDeal
    result.oppsNeeded = (target / avgDeal / winRate) * safety
  }

  // currentPipeline may legitimately be 0 (no pipeline yet), so accept >= 0.
  const current = input.currentPipeline
  if (typeof current === 'number' && Number.isFinite(current) && current >= 0) {
    const effective = current * qualifiedRate
    result.effectiveCurrentPipeline = effective
    result.currentCoverage = effective / target
    result.pipelineGap = requiredPipeline - effective
  }

  return result
}

function invalid(error: string): CoverageResult {
  return {
    valid: false,
    error,
    winRate: 0,
    requiredCoverage: 0,
    requiredPipeline: 0,
    lazyThreeXPipeline: 0,
    vsLazyThreeX: 0,
  }
}

/** Segment presets — typical win rates by motion (directional industry ranges). */
export const COVERAGE_PRESETS = [
  { id: 'smb', label: 'SMB / transactional', winRatePct: 35 },
  { id: 'midmarket', label: 'Mid-market', winRatePct: 25 },
  { id: 'enterprise', label: 'Enterprise', winRatePct: 18 },
] as const

/** Keep digits and at most one decimal point; drops grouping commas, signs and letters. */
export function sanitizeAmount(v: string): string {
  const cleaned = v.replace(/[^\d.]/g, '')
  const dot = cleaned.indexOf('.')
  if (dot === -1) return cleaned
  return `${cleaned.slice(0, dot + 1)}${cleaned.slice(dot + 1).replace(/\./g, '')}`
}

/**
 * Why a typed or pasted money amount cannot be used, or null when it can.
 * Grouping commas, spaces and a leading "$" are formatting and allowed; a sign,
 * exponent notation, letters (such as the "M" in "1.5M") and repeated decimal
 * points are rejected so the value is never silently reinterpreted.
 */
export function amountInputError(raw: string): string | null {
  if (raw.includes('-')) return 'Negative amounts are not allowed. Enter a positive number.'
  if (/[eE]/.test(raw)) {
    return 'Exponent notation (like 1e6) is not supported. Type the full number.'
  }
  if (/[^\d.,\s$]/.test(raw)) {
    return 'Use digits only. Remove letters and symbols (for example the M in 1.5M).'
  }
  if ((raw.match(/\./g) ?? []).length > 1) return 'Use a single decimal point.'
  return null
}

/** Display form of a raw amount: grouped integer digits, any decimal part kept as typed. */
export function formatGrouped(raw: string): string {
  const clean = sanitizeAmount(raw)
  if (clean === '') return ''
  const [int = '', frac] = clean.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return frac === undefined ? grouped : `${grouped}.${frac}`
}

/**
 * Caret position in `next` (a re-grouped copy of `prev`) that sits after the same
 * number of digits and decimal points as `caret` did in `prev`, so inserting a
 * grouping comma never throws the caret to the end.
 */
export function caretAfterFormat(prev: string, caret: number, next: string): number {
  const significant = (ch: string) => /[\d.]/.test(ch)
  let before = 0
  for (const ch of prev.slice(0, caret)) if (significant(ch)) before += 1
  if (before === 0) return 0
  let seen = 0
  for (let i = 0; i < next.length; i += 1) {
    if (significant(next.charAt(i))) seen += 1
    if (seen === before) return i + 1
  }
  return next.length
}
