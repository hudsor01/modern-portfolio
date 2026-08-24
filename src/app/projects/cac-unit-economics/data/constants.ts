// ILLUSTRATIVE DATASET — these are NOT measured results.
//
// Every figure here depends on customer acquisition cost, and the 2024
// partner-platform export that backs the other project pages contains no cost,
// spend or budget column of any kind — so CAC, LTV:CAC, payback period and
// margin cannot be derived from it. `subscription_plan` is also empty across all
// 5,640 transaction rows, so the product-tier economics below have no source
// either.
//
// They are kept because the modelling approach is the point of the case study:
// this is how the analysis is structured, what levers it exposes, and how the
// output is read. The UI marks every chart on this page with
// <DataProvenance variant="illustrative" /> so a reader is never told these are
// outcomes that were measured.
//
// If a future export carries cost data, derive these the same way
// scripts/derive-partner-metrics.ts handles the partner metrics.

export const cacMetrics = {
  partnerDrivenCAC: 127,
  directCAC: 289,
  blendedCAC: 168,
  averageLTV: 612,
  paybackPeriod: 8.4,
  ltv_cac_ratio: 3.6,
  grossMargin: 78.5,
  monthlyChurn: 4.2,
}

export const channelPerformance = [
  { channel: 'Certified Partners', cac: 98, ltv: 687, customers: 1089, efficiency: 7.0 },
  { channel: 'Legacy Partners', cac: 156, ltv: 578, customers: 743, efficiency: 3.7 },
  { channel: 'Direct Sales', cac: 289, ltv: 534, customers: 201, efficiency: 1.8 },
  { channel: 'Inactive Partners', cac: 234, ltv: 445, customers: 67, efficiency: 1.9 },
]

export const productTierEconomics = [
  { tier: 'Enterprise Pro ($349)', cac: 156, ltv: 892, margin: 83.2, payback: 6.2 },
  { tier: 'Business Plus ($199)', cac: 134, ltv: 567, margin: 78.9, payback: 7.8 },
  { tier: 'Starter Web ($99)', cac: 89, ltv: 287, margin: 71.4, payback: 9.1 },
  { tier: 'Support ($9)', cac: 12, ltv: 43, margin: 65.8, payback: 2.1 },
]

// Unit economics progression over time (LTV, CAC, ratio trends)
export const unitEconomicsTrendData = [
  { month: 'Jan', ltv: 534, cac: 189, ratio: 2.8, payback: 11.2 },
  { month: 'Feb', ltv: 548, cac: 178, ratio: 3.1, payback: 10.8 },
  { month: 'Mar', ltv: 567, cac: 172, ratio: 3.3, payback: 10.1 },
  { month: 'Apr', ltv: 582, cac: 168, ratio: 3.5, payback: 9.4 },
  { month: 'May', ltv: 595, cac: 165, ratio: 3.6, payback: 8.9 },
  { month: 'Jun', ltv: 612, cac: 161, ratio: 3.8, payback: 8.4 },
  { month: 'Jul', ltv: 618, cac: 158, ratio: 3.9, payback: 8.1 },
  { month: 'Aug', ltv: 625, cac: 156, ratio: 4.0, payback: 7.8 },
]
