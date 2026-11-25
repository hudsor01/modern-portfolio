const QUARTER_LABEL = /^Q[1-4] \d{4}$/

/** Derive the revenue trend chart title from its own period labels. */
export function deriveRevenueTrendTitle(labels: readonly string[]): string {
  const first = labels[0]
  const last = labels[labels.length - 1]
  if (first === undefined || last === undefined) return 'Revenue Trend'
  const kind = labels.every((l) => QUARTER_LABEL.test(l)) ? 'Quarterly' : 'Monthly'
  return first === last ? `${kind} Revenue · ${first}` : `${kind} Revenue · ${first}–${last}`
}
