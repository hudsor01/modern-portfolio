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
 * Per-surface labels intentionally differ ('Revenue Optimized' vs
 * 'Revenue Generated' vs 'Revenue Impact'); only the values are canonical.
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

/**
 * Labeled list for table-style consumers that want a default label alongside
 * each value. Consumers may override `label` for their surface.
 */
export const HEADLINE_STATS = [
  { key: 'revenue', value: REVENUE_IMPACT, label: 'Revenue Impact' },
  { key: 'growth', value: TRANSACTION_GROWTH, label: 'Transaction Growth' },
  { key: 'network', value: NETWORK_GROWTH, label: 'Network Expansion' },
  { key: 'experience', value: YEARS_EXPERIENCE, label: 'Years Experience' },
] as const
