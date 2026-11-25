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

/** Mirrors `revalidate` in src/app/projects/revenue-kpi/page.tsx (guarded by growth.test.ts). */
export const REVENUE_KPI_REVALIDATE_SECONDS = 3600

/**
 * Longest a served revenue-kpi page can trail the clock (WR-04): its ISR window,
 * plus the 8-minute in-memory analytics bundle a regeneration may reuse
 * (src/lib/data-service/service.ts), plus the 1-hour CDN-Cache-Control edge TTL
 * on /projects/* (next.config.js; a local standalone server has none, so this
 * only over-allows there).
 */
export const REVENUE_TREND_MAX_LAG_MS = (REVENUE_KPI_REVALIDATE_SECONDS + 8 * 60 + 3600) * 1000

/**
 * Titles a page regenerated on that schedule may correctly show at `now`: the
 * current window, plus the previous one while `now` is within the maximum lag
 * of a quarter rollover.
 */
export function acceptableRevenueTrendTitles(now: Date = new Date()): string[] {
  const current = expectedRevenueTrendTitle(now)
  const lagged = expectedRevenueTrendTitle(new Date(now.getTime() - REVENUE_TREND_MAX_LAG_MS))
  return lagged === current ? [current] : [current, lagged]
}
