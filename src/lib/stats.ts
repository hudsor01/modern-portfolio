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
