/**
 * Canonical headline statistics — single source of truth.
 *
 * These figures appear across the home, about, resume, contact, and projects
 * surfaces. Previously they were duplicated as hardcoded literals in ~7 files;
 * import from here instead so a number only ever changes in one place.
 *
 * Two shapes are exported for each metric:
 *   - the display string (e.g. '$4.8M+') for static text
 *   - the raw numeric value (e.g. 4.8) for animated counters such as the
 *     homepage NumberTicker, which formats the prefix/suffix itself.
 *
 * Labels are canonical too: every surface imports value and label from here.
 */

/** Display strings. */
export const REVENUE_IMPACT = '$4.8M+'
export const TRANSACTION_GROWTH = '432%'
export const NETWORK_GROWTH = '2,217%'
export const YEARS_EXPERIENCE = '10+'

/** Raw numeric values for animated counters (NumberTicker formats prefix/suffix). */
export const REVENUE_IMPACT_VALUE = 4.8
export const TRANSACTION_GROWTH_VALUE = 432
export const NETWORK_GROWTH_VALUE = 2217
export const YEARS_EXPERIENCE_VALUE = 10

/** Canonical labels. */
export const REVENUE_IMPACT_LABEL = 'Revenue Impact'
export const TRANSACTION_GROWTH_LABEL = 'Transaction Growth'
export const NETWORK_GROWTH_LABEL = 'Network Growth'
export const YEARS_EXPERIENCE_LABEL = 'Years Experience'

/** The one context line, shown only with the 432% stat. */
export const TRANSACTION_GROWTH_CONTEXT = 'On track year-over-year, per the Revenue KPI case study'

export type StatKey = 'revenue' | 'transaction-growth' | 'network-growth' | 'years'

export const STAT_LABELS: Record<StatKey, string> = {
  revenue: REVENUE_IMPACT_LABEL,
  'transaction-growth': TRANSACTION_GROWTH_LABEL,
  'network-growth': NETWORK_GROWTH_LABEL,
  years: YEARS_EXPERIENCE_LABEL,
}

export const STAT_VALUES: Record<StatKey, string> = {
  revenue: REVENUE_IMPACT,
  'transaction-growth': TRANSACTION_GROWTH,
  'network-growth': NETWORK_GROWTH,
  years: YEARS_EXPERIENCE,
}
