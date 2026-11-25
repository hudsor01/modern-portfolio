/**
 * Independent America/Chicago oracle for the revenue-kpi trend title.
 * Deliberately imports nothing from src: it re-derives the expected series
 * so the e2e fails if the generator drifts.
 */

/** Mirrors src/lib/data-service/generators/growth.ts (owner rule A11Y-07). */
export const REVENUE_TREND_QUARTERS = 7

function chicagoYearMonth(now: Date): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(now)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { year: get('year'), month: get('month') - 1 }
}

export function inProgressQuarterLabel(now: Date = new Date()): string {
  const { year, month } = chicagoYearMonth(now)
  return `Q${Math.floor(month / 3) + 1} ${year}`
}

export function lastCompletedQuarterLabels(
  now: Date = new Date(),
  count: number = REVENUE_TREND_QUARTERS
): string[] {
  const { year, month } = chicagoYearMonth(now)
  // Quarter index since year 0; the last completed one precedes the in-progress quarter.
  const last = year * 4 + Math.floor(month / 3) - 1
  const labels: string[] = []
  for (let i = count - 1; i >= 0; i--) {
    const idx = last - i
    labels.push(`Q${(idx % 4) + 1} ${Math.floor(idx / 4)}`)
  }
  return labels
}

export function expectedRevenueTrendTitle(now: Date = new Date()): string {
  const labels = lastCompletedQuarterLabels(now)
  return `Quarterly Revenue · ${labels[0]}–${labels[labels.length - 1]}`
}
