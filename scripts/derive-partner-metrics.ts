/**
 * derive-partner-metrics.ts — turn a raw partner-platform export into committed,
 * non-identifying aggregates.
 *
 * WHY THIS EXISTS
 * The project pages carry hand-written chart arrays. The underlying 2024 export
 * (customers / partners / deals / transactions) contains real names, emails,
 * phone numbers and company names, so it can never live in this repo. This
 * script reads that export from a LOCAL path, emits only counts, sums, rates and
 * time series, and writes src/data/partner-program-metrics.ts.
 *
 * The raw CSVs are NOT committed and must never be. Only this script's output is.
 *
 * Usage:
 *   bun run scripts/derive-partner-metrics.ts /path/to/export-dir
 *
 * Expects: customers.csv, partners.csv, deals.csv, transactions.csv
 *
 * SAFETY MODEL
 * 1. Column allowlist — PII_COLUMNS are never read. Reading is opt-in, not
 *    opt-out, so a new sensitive column in a future export cannot leak by
 *    default.
 * 2. k-anonymity — any bucket with fewer than K members is dropped, so a
 *    category can never narrow to a single identifiable partner or customer.
 * 3. Aggregates only — no row-level values, no keys, no free text. Free-text
 *    fields (e.g. deal_lost_reason) are excluded entirely rather than
 *    normalised, since they can embed names.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const K = 5

/** Never read. Listed explicitly so the exclusion is reviewable, not implicit. */
const PII_COLUMNS = [
  'partner_name', 'partner_company_name', 'partner_manager', 'partner_email',
  'customer_name', 'customer_email', 'customer_company',
  'deal_email', 'deal_account_name', 'deal_contact_first_name', 'deal_contact_last_name',
  'Business Name', 'Contact First Name', 'Contact Last Name', 'Channel Manager',
  'Phone', 'City', 'State', 'Country', 'Additional Information',
  'deal_lost_reason', 'unapproved_reasons',
  'customer_key', 'customer_ps_key', 'transaction_key', 'commission_key',
  'Deal ID (internal use only)', 'mpa',
] as const

/**
 * Tier labels safe to publish. ALLOWLIST, not blocklist — `partner_group` is a
 * free-text field and in the 2024 export it carried real company names
 * ("Thryv Employees", "Telarus - Uncertified") alongside genuine program tiers.
 * k-anonymity does not catch those: the buckets clear k, but the LABEL itself
 * identifies an organisation. Anything not listed here is folded into "Other
 * programs", so a new company-named group in a future export is bucketed by
 * default rather than published.
 */
const PUBLISHABLE_TIERS = new Set([
  'Affiliate Partners',
  'Uncertified Partners',
  'Uncertified Partners - Legacy',
  'Certified Partners',
  'Inactive Partners',
  'Ambassadors',
  'Franchise - Affiliate',
  'Franchise Partner Program - 5%',
  'AUS - Affiliate',
  'Default',
])
/**
 * Internal program names -> generic industry vocabulary.
 *
 * The source labels are a specific employer's internal taxonomy — strings like
 * "Franchise Partner Program - 5%" and "AUS - Affiliate" are a fingerprint: the
 * résumé names the employer, so publishing their exact program names ties these
 * figures straight back to a named company's internal reporting. The generic
 * equivalents carry the same analytical meaning ("certified partners outperform
 * uncertified") without reproducing anyone's taxonomy.
 */
const TIER_DISPLAY: Record<string, string> = {
  'Certified Partners': 'Certified',
  'Uncertified Partners': 'Uncertified',
  'Uncertified Partners - Legacy': 'Legacy',
  'Affiliate Partners': 'Affiliate',
  'Franchise - Affiliate': 'Franchise',
  'Franchise Partner Program - 5%': 'Franchise',
  'AUS - Affiliate': 'Affiliate',
  'Inactive Partners': 'Inactive',
  Ambassadors: 'Ambassador',
  Default: 'Unclassified',
}
const OTHER_TIER = 'Other'
const safeTier = (raw: string): string =>
  PUBLISHABLE_TIERS.has(raw) ? (TIER_DISPLAY[raw] ?? OTHER_TIER) : OTHER_TIER


/**
 * Round so the published figures cannot be matched exactly against the source
 * report. Magnitude and every ratio survive; an exact-value match does not.
 * Rates are left alone — a percentage is an analytical result, not a fingerprint.
 */
const roundMoney = (n: number): number => {
  if (n === 0) return 0
  const mag = 10 ** (Math.floor(Math.log10(Math.abs(n))) - 2) // 3 significant figures
  return Math.round(n / mag) * mag
}
const roundCount = (n: number): number => (n < 100 ? n : Math.round(n / 10) * 10)

type Row = Record<string, string>

function parseCsv(path: string): Row[] {
  const text = readFileSync(path, 'utf8')
  const rows: string[][] = []
  let field = ''
  let record: string[] = []
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false }
      } else field += ch
    } else if (ch === '"') inQuotes = true
    else if (ch === ',') { record.push(field); field = '' }
    else if (ch === '\n') { record.push(field); rows.push(record); record = []; field = '' }
    else if (ch !== '\r') field += ch
  }
  if (field || record.length) { record.push(field); rows.push(record) }

  const header = rows.shift() ?? []
  // Drop PII columns at parse time — they never enter memory as named fields.
  const keep = header.map((h) => !PII_COLUMNS.includes(h as (typeof PII_COLUMNS)[number]))
  return rows
    .filter((r) => r.length === header.length)
    .map((r) => {
      const o: Row = {}
      header.forEach((h, i) => { if (keep[i]) o[h] = r[i] ?? '' })
      return o
    })
}

const num = (s: string | undefined): number => {
  const n = Number.parseFloat(String(s ?? '').replace(/[$,]/g, '').trim())
  return Number.isFinite(n) ? n : 0
}
const yearMonth = (s: string | undefined): string | null => {
  const v = String(s ?? '').trim().split(/[T ]/)[0] ?? ''
  return /^\d{4}[-/]\d{2}/.test(v) ? v.slice(0, 7).replace('/', '-') : null
}
const isTrue = (s: string | undefined): boolean =>
  ['true', '1', 'yes'].includes(String(s ?? '').trim().toLowerCase())

/** Collapse to buckets, then drop anything below the k-anonymity floor. */
function tally<T>(rows: T[], key: (r: T) => string | null): Array<[string, number]> {
  const m = new Map<string, number>()
  for (const r of rows) {
    const k = key(r)
    if (k) m.set(k, (m.get(k) ?? 0) + 1)
  }
  return [...m.entries()].filter(([, n]) => n >= K).sort((a, b) => b[1] - a[1])
}

function main() {
  const dir = process.argv[2]
  if (!dir) {
    console.error('usage: bun run scripts/derive-partner-metrics.ts <export-dir>')
    process.exit(1)
  }

  const partners = parseCsv(join(dir, 'partners.csv'))
  const transactions = parseCsv(join(dir, 'transactions.csv'))
  const deals = parseCsv(join(dir, 'deals.csv'))
  const customers = parseCsv(join(dir, 'customers.csv'))

  const grossVolume = transactions.reduce((s, r) => s + num(r.transaction_amount), 0)
  const commissions = transactions.reduce((s, r) => s + num(r.commission_amount), 0)
  const paidCustomers = customers.filter((r) => isTrue(r.customer_has_paid)).length

  const stages = Object.fromEntries(tally(deals, (r) => r.deal_stage?.trim() || null))
  const won = stages['Closed Won'] ?? 0
  const lost = stages['Closed Lost'] ?? 0

  // partner_id is an opaque platform integer, used only to join tier -> revenue.
  // It is aggregated away before output; no id reaches the emitted file.
  const tierOf = new Map(partners.map((r) => [r.partner_id, safeTier(r.partner_group?.trim() || 'Unassigned')]))
  const byTier = new Map<string, { partners: Set<string>; transactions: number; revenue: number }>()
  for (const r of transactions) {
    const partnerId = r.partner_id
    if (!partnerId) continue
    const tier = tierOf.get(partnerId) ?? 'Unassigned'
    const e = byTier.get(tier) ?? { partners: new Set<string>(), transactions: 0, revenue: 0 }
    e.partners.add(partnerId)
    e.transactions += 1
    e.revenue += num(r.transaction_amount)
    byTier.set(tier, e)
  }

  // Per-tier deal outcomes. Deals carry partner_id, so win rate and time-to-close
  // are derivable per tier. "ROI multiple" is NOT — the export has no cost data —
  // so it is deliberately absent rather than estimated.
  const dealsByTier = new Map<string, { won: number; lost: number; closeDays: number[] }>()
  for (const r of deals) {
    const partnerId = r.partner_id
    if (!partnerId) continue
    const tier = tierOf.get(partnerId) ?? 'Unassigned'
    const e = dealsByTier.get(tier) ?? { won: 0, lost: 0, closeDays: [] }
    const stage = r.deal_stage?.trim()
    if (stage === 'Closed Won') e.won += 1
    else if (stage === 'Closed Lost') e.lost += 1
    const start = Date.parse(String(r.deal_created_date ?? '').split(/[T ]/)[0] ?? '')
    const end = Date.parse(String(r.deal_close_date ?? '').split(/[T ]/)[0] ?? '')
    if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
      e.closeDays.push(Math.round((end - start) / 86_400_000))
    }
    dealsByTier.set(tier, e)
  }
  const tierDeals = (tier: string) => {
    const e = dealsByTier.get(tier)
    if (!e || e.won + e.lost < K) return { winRatePct: 0, medianDaysToClose: 0 }
    const sorted = [...e.closeDays].sort((a, b) => a - b)
    return {
      winRatePct: Number(((e.won / (e.won + e.lost)) * 100).toFixed(1)),
      medianDaysToClose: sorted.length ? (sorted[Math.floor(sorted.length / 2)] ?? 0) : 0,
    }
  }

  const monthly = new Map<string, { transactions: number; revenue: number }>()
  for (const r of transactions) {
    const m = yearMonth(r.transaction_create_date)
    if (!m) continue
    const e = monthly.get(m) ?? { transactions: 0, revenue: 0 }
    e.transactions += 1
    e.revenue += num(r.transaction_amount)
    monthly.set(m, e)
  }

  const out = {
    totals: {
      partners: roundCount(partners.length),
      customers: roundCount(customers.length),
      transactions: roundCount(transactions.length),
      deals: roundCount(deals.length),
      grossVolumeUsd: roundMoney(grossVolume),
      commissionsPaidUsd: roundMoney(commissions),
      commissionRatePct: Number(((commissions / grossVolume) * 100).toFixed(1)),
      paidConversionPct: Number(((paidCustomers / customers.length) * 100).toFixed(1)),
    },
    dealFunnel: Object.entries(stages)
      .map(([stage, count]) => ({ stage, count: roundCount(count) }))
      .sort((a, b) => b.count - a.count),
    dealWinRatePct: won + lost > 0 ? Number(((won / (won + lost)) * 100).toFixed(1)) : 0,
    partnerTiers: tally(partners, (r) => (r.partner_group?.trim() ? safeTier(r.partner_group.trim()) : null))
      .map(([tier, count]) => {
        const t = byTier.get(tier)
        const active = t && t.partners.size >= K ? t : null
        return {
          tier,
          count: roundCount(count),
          activePartners: active ? roundCount(active.partners.size) : 0,
          transactions: active ? roundCount(active.transactions) : 0,
          revenueUsd: active ? roundMoney(active.revenue) : 0,
          avgTransactionUsd:
            active && active.transactions > 0
              ? roundMoney(active.revenue / active.transactions)
              : 0,
          ...tierDeals(tier),
        }
      }),
    monthlyVolume: [...monthly.entries()]
      .filter(([, v]) => v.transactions >= K)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, transactions: roundCount(v.transactions), revenueUsd: roundMoney(v.revenue) })),
  }

  const banner = `// GENERATED — do not edit by hand.
// Produced by scripts/derive-partner-metrics.ts from a 2024 partner-platform
// export that is NOT in this repo and must never be committed.
//
// Contains aggregates only: counts, sums, rates and monthly series. Every
// name, email, phone, company and record key is excluded at parse time via
// PII_COLUMNS, and any bucket smaller than k=${K} is dropped so a category can
// never narrow to one identifiable partner or customer.
//
// To regenerate:  bun run scripts/derive-partner-metrics.ts <export-dir>
`

  const body = `${banner}
export const partnerProgramMetrics = ${JSON.stringify(out, null, 2)} as const

export type PartnerProgramMetrics = typeof partnerProgramMetrics
`

  const dest = join(process.cwd(), 'src/data/partner-program-metrics.ts')
  writeFileSync(dest, body)

  // Format the emitted file so a regeneration never fails `bun run lint`.
  // JSON.stringify produces quoted keys and 2-space indent that Biome rewrites.
  spawnSync('bunx', ['biome', 'check', '--write', dest], { stdio: 'ignore' })

  console.log(`wrote ${dest}`)
  console.log(`  totals: ${JSON.stringify(out.totals)}`)
  console.log(`  tiers: ${out.partnerTiers.length}, months: ${out.monthlyVolume.length}`)
}

main()
