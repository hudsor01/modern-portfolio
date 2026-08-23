// GENERATED — do not edit by hand.
// Produced by scripts/derive-partner-metrics.ts from a 2024 partner-platform
// export that is NOT in this repo and must never be committed.
//
// Contains aggregates only: counts, sums, rates and monthly series. Every
// name, email, phone, company and record key is excluded at parse time via
// PII_COLUMNS, and any bucket smaller than k=5 is dropped so a category can
// never narrow to one identifiable partner or customer.
//
// To regenerate:  bun run scripts/derive-partner-metrics.ts <export-dir>

export const partnerProgramMetrics = {
  totals: {
    partners: 2147,
    customers: 7935,
    transactions: 5644,
    deals: 1696,
    grossVolumeUsd: 1131217,
    commissionsPaidUsd: 262750,
    commissionRatePct: 23.2,
    paidConversionPct: 14.1,
  },
  dealFunnel: [
    {
      stage: 'Working',
      count: 1136,
    },
    {
      stage: 'Closed Won',
      count: 470,
    },
    {
      stage: 'Closed Lost',
      count: 90,
    },
  ],
  dealWinRatePct: 83.9,
  partnerTiers: [
    {
      tier: 'Affiliate Partners',
      count: 787,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 0,
      medianDaysToClose: 0,
    },
    {
      tier: 'Uncertified Partners',
      count: 533,
      activePartners: 42,
      transactions: 581,
      revenueUsd: 119095,
      avgTransactionUsd: 205,
      winRatePct: 87.3,
      medianDaysToClose: 5,
    },
    {
      tier: 'Default',
      count: 281,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 0,
      medianDaysToClose: 0,
    },
    {
      tier: 'Certified Partners',
      count: 246,
      activePartners: 72,
      transactions: 1997,
      revenueUsd: 368059,
      avgTransactionUsd: 184,
      winRatePct: 77.3,
      medianDaysToClose: 27,
    },
    {
      tier: 'Uncertified Partners - Legacy',
      count: 128,
      activePartners: 43,
      transactions: 1337,
      revenueUsd: 250556,
      avgTransactionUsd: 187,
      winRatePct: 94.7,
      medianDaysToClose: 4,
    },
    {
      tier: 'Inactive Partners',
      count: 44,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 100,
      medianDaysToClose: 12,
    },
    {
      tier: 'Other programs',
      count: 44,
      activePartners: 15,
      transactions: 1689,
      revenueUsd: 385672,
      avgTransactionUsd: 228,
      winRatePct: 100,
      medianDaysToClose: 3,
    },
    {
      tier: 'Franchise - Affiliate',
      count: 41,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 0,
      medianDaysToClose: 0,
    },
    {
      tier: 'Ambassadors',
      count: 19,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 0,
      medianDaysToClose: 0,
    },
    {
      tier: 'Franchise Partner Program - 5%',
      count: 10,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 0,
      medianDaysToClose: 0,
    },
    {
      tier: 'AUS - Affiliate',
      count: 7,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 0,
      medianDaysToClose: 0,
    },
  ],
  monthlyVolume: [
    {
      month: '2024-01',
      transactions: 1132,
      revenueUsd: 186322,
    },
    {
      month: '2024-02',
      transactions: 544,
      revenueUsd: 95789,
    },
    {
      month: '2024-03',
      transactions: 667,
      revenueUsd: 107758,
    },
    {
      month: '2024-04',
      transactions: 646,
      revenueUsd: 130723,
    },
    {
      month: '2024-05',
      transactions: 657,
      revenueUsd: 122908,
    },
    {
      month: '2024-06',
      transactions: 135,
      revenueUsd: 32200,
    },
    {
      month: '2024-07',
      transactions: 629,
      revenueUsd: 112498,
    },
    {
      month: '2024-08',
      transactions: 797,
      revenueUsd: 213730,
    },
    {
      month: '2024-09',
      transactions: 58,
      revenueUsd: 18180,
    },
    {
      month: '2024-10',
      transactions: 379,
      revenueUsd: 111109,
    },
  ],
} as const

export type PartnerProgramMetrics = typeof partnerProgramMetrics
