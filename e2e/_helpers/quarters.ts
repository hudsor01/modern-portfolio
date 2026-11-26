/**
 * Independent America/Chicago oracle for the revenue-kpi trend title.
 * Deliberately imports nothing from src: it re-derives the expected series
 * so the e2e fails if the generator drifts.
 */

/**
 * Expected series length; mirrors REVENUE_TREND_QUARTERS in
 * src/lib/data-service/generators/growth.ts (owner rule A11Y-07) without importing it.
 */
export const EXPECTED_TREND_QUARTERS = 7

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

function lastCompletedQuarterLabels(
  now: Date = new Date(),
  count: number = EXPECTED_TREND_QUARTERS
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
 * The window within which the e2e accepts the previous quarter's title (WR-04):
 * the ISR window, plus the 8-minute in-memory analytics bundle a regeneration may
 * reuse (src/lib/data-service/service.ts), plus the 1-hour CDN-Cache-Control edge
 * TTL on /projects/* (next.config.js; a local standalone server has none, so this
 * only over-allows there). ISR regenerates on traffic with no guaranteed bound, so
 * an idle page can be older; that is why the spec re-requests until a render
 * inside this window is served.
 */
const REVENUE_TREND_MAX_LAG_MS = (REVENUE_KPI_REVALIDATE_SECONDS + 8 * 60 + 3600) * 1000

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
