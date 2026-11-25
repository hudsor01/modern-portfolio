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
    return invalid(TARGET_REQUIRED_MESSAGE)
  }
  if (typeof winRatePct !== 'number' || !Number.isFinite(winRatePct) || winRatePct <= 0) {
    return invalid(WIN_RATE_POSITIVE_MESSAGE)
  }
  if (winRatePct > 100) {
    return invalid(WIN_RATE_MAX_MESSAGE)
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

export type AmountKind = 'target' | 'amount'

export const NUMBERS_ONLY_MESSAGE = 'Enter numbers only'
export const TARGET_REQUIRED_MESSAGE = 'Enter a revenue target greater than $0.'
export const WIN_RATE_REQUIRED_MESSAGE = 'Enter a win rate.'
export const WIN_RATE_POSITIVE_MESSAGE = 'Win rate must be greater than 0%.'
export const WIN_RATE_MAX_MESSAGE = 'Win rate can’t exceed 100%.'
export const NEGATIVE_MESSAGE = 'Negative amounts are not allowed. Enter a positive number.'
/** Largest money amount any field accepts, in dollars. */
export const MAX_AMOUNT = 10_000_000_000

/** One leading minus sign (hyphen or Unicode minus), optionally after "$" and spaces. */
const LEADING_MINUS = /^(\s*(?:\$\s*)?)[-\u2212]/

/**
 * Why a typed or pasted money amount cannot be used, or null when it can.
 * Grouping commas, spaces and a leading "$" are formatting and allowed. Checks run
 * in this order so each failure gets one precise message: after setting aside one
 * leading minus sign ("-5", "−5", "$-5", "-$5"), any character that is not a digit,
 * ".", ",", whitespace or "$" (letters, scientific forms like 1e6, suffixes like the
 * M in 1.5M, "+", or a minus anywhere but the start, as in 5-3) -> "Enter numbers
 * only"; then the leading minus -> the negative message; then a repeated decimal
 * point; then a value above MAX_AMOUNT ($10B). The cap applies to the revenue
 * target and also to average deal size and open pipeline: an uncapped open
 * pipeline would make `effectiveCurrentPipeline` and `currentCoverage` unbounded.
 */
export function amountInputError(raw: string, kind: AmountKind): string | null {
  const unsigned = raw.replace(LEADING_MINUS, '$1')
  if (/[^\d.,\s$]/.test(unsigned)) return NUMBERS_ONLY_MESSAGE
  if (unsigned !== raw) return NEGATIVE_MESSAGE
  if ((raw.match(/\./g) ?? []).length > 1) return 'Use a single decimal point.'
  if (Number(sanitizeAmount(raw)) > MAX_AMOUNT) {
    return kind === 'target' ? 'Enter a target up to $10B' : 'Enter an amount up to $10B'
  }
  return null
}

/**
 * Why the revenue target field cannot be used, or null when it can: any
 * amountInputError, then an empty or zero target. The target is required, so an
 * empty field is an error on the field itself rather than only in the results.
 */
export function targetFieldError(raw: string): string | null {
  const error = amountInputError(raw, 'target')
  if (error !== null) return error
  return Number(sanitizeAmount(raw)) > 0 ? null : TARGET_REQUIRED_MESSAGE
}

export type PercentField = 'win' | 'qualified' | 'safety'

/**
 * Why a percent field's value cannot be used, or null when it can. `badInput` is the
 * input's `validity.badInput`: a type="number" input reports '' for malformed text,
 * so the flag is the only way to tell it from an empty field. An empty win rate is an
 * error (the field is required); an empty optional field is not, since it falls back
 * to its default in computeCoverage.
 */
export function percentFieldError(
  raw: string,
  badInput: boolean,
  field: PercentField
): string | null {
  if (badInput) return NUMBERS_ONLY_MESSAGE
  if (raw.trim() === '') return field === 'win' ? WIN_RATE_REQUIRED_MESSAGE : null
  const n = Number(raw)
  if (!Number.isFinite(n)) return NUMBERS_ONLY_MESSAGE
  if (n < 0) return NEGATIVE_MESSAGE
  if (field === 'win') {
    if (n === 0) return WIN_RATE_POSITIVE_MESSAGE
    if (n > 100) return WIN_RATE_MAX_MESSAGE
  } else if (field === 'qualified') {
    if (n > 100) return 'Enter a percentage up to 100%.'
  } else if (n > 1000) {
    return 'Enter a margin up to 1,000%.'
  }
  return null
}

const usd0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const MAX_DISPLAY_MONEY = 1_000_000_000_000
export const MAX_DISPLAY_MULTIPLE = 1_000
export const MAX_DISPLAY_COUNT = 1_000_000_000

// Display rule: a value at or above its ceiling renders as the ceiling followed by "+".

export function formatMoney(n: number): string {
  if (n >= MAX_DISPLAY_MONEY) return '$1T+'
  if (Math.abs(n) < 1_000_000) return usd0.format(n)
  // Compact notation rounds, so values just under the ceiling print "$1T": that is the ceiling.
  const s = usdCompact.format(n)
  return s === '$1T' ? '$1T+' : s
}

export function formatMultiple(n: number): string {
  if (Math.round(n * 10) / 10 >= MAX_DISPLAY_MULTIPLE) return '1,000×+'
  return `${n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}×`
}

/**
 * A percentage as a person would write it, never as typed: "1e1" -> "10%",
 * "33.3333" -> "33.33%", and a rate below 1% keeps two significant digits
 * ("0.0001%") instead of rounding to "0%".
 */
export function formatPercent(n: number): string {
  const digits = n < 1 ? { maximumSignificantDigits: 2 } : { maximumFractionDigits: 2 }
  return `${n.toLocaleString('en-US', digits)}%`
}

export function formatCount(n: number): string {
  const c = Math.ceil(n)
  if (c >= MAX_DISPLAY_COUNT) return '1,000,000,000+'
  return c.toLocaleString('en-US')
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
