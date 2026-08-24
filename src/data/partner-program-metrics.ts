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
    partners: 2150,
    customers: 7940,
    transactions: 5640,
    deals: 1700,
    grossVolumeUsd: 1130000,
    commissionsPaidUsd: 263000,
    commissionRatePct: 23.2,
    paidConversionPct: 14.1,
  },
  dealFunnel: [
    {
      stage: 'Working',
      count: 1140,
      avgAmountUsd: 1200,
    },
    {
      stage: 'Closed Won',
      count: 470,
      avgAmountUsd: 300,
    },
    {
      stage: 'Closed Lost',
      count: 90,
      avgAmountUsd: 317,
    },
  ],
  dealWinRatePct: 83.9,
  partnerTiers: [
    {
      tier: 'Affiliate',
      count: 790,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 0,
      medianDaysToClose: 0,
    },
    {
      tier: 'Uncertified',
      count: 530,
      activePartners: 42,
      transactions: 580,
      revenueUsd: 119000,
      avgTransactionUsd: 205,
      winRatePct: 87.3,
      medianDaysToClose: 5,
    },
    {
      tier: 'Unclassified',
      count: 280,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 0,
      medianDaysToClose: 0,
    },
    {
      tier: 'Certified',
      count: 250,
      activePartners: 72,
      transactions: 2000,
      revenueUsd: 368000,
      avgTransactionUsd: 184,
      winRatePct: 77.3,
      medianDaysToClose: 27,
    },
    {
      tier: 'Legacy',
      count: 130,
      activePartners: 43,
      transactions: 1340,
      revenueUsd: 251000,
      avgTransactionUsd: 187,
      winRatePct: 94.7,
      medianDaysToClose: 4,
    },
    {
      tier: 'Franchise',
      count: 51,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 0,
      medianDaysToClose: 0,
    },
    {
      tier: 'Inactive',
      count: 44,
      activePartners: 0,
      transactions: 0,
      revenueUsd: 0,
      avgTransactionUsd: 0,
      winRatePct: 100,
      medianDaysToClose: 12,
    },
    {
      tier: 'Other',
      count: 44,
      activePartners: 15,
      transactions: 1690,
      revenueUsd: 386000,
      avgTransactionUsd: 228,
      winRatePct: 100,
      medianDaysToClose: 3,
    },
    {
      tier: 'Ambassador',
      count: 19,
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
      transactions: 1130,
      revenueUsd: 186000,
    },
    {
      month: '2024-02',
      transactions: 540,
      revenueUsd: 95800,
    },
    {
      month: '2024-03',
      transactions: 670,
      revenueUsd: 108000,
    },
    {
      month: '2024-04',
      transactions: 650,
      revenueUsd: 131000,
    },
    {
      month: '2024-05',
      transactions: 660,
      revenueUsd: 123000,
    },
    {
      month: '2024-06',
      transactions: 140,
      revenueUsd: 32200,
    },
    {
      month: '2024-07',
      transactions: 630,
      revenueUsd: 112000,
    },
    {
      month: '2024-08',
      transactions: 800,
      revenueUsd: 214000,
    },
    {
      month: '2024-09',
      transactions: 58,
      revenueUsd: 18200,
    },
    {
      month: '2024-10',
      transactions: 380,
      revenueUsd: 111000,
    },
  ],
} as const

export type PartnerProgramMetrics = typeof partnerProgramMetrics
