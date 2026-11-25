import { partnerProgramMetrics } from '@/data/partner-program-metrics'

export interface FunnelStage {
  name: string
  count: number
  avg_deal_size: number
}

export interface PartnerConversion {
  group: string
  median_days_to_close: number
}

export interface ConversionRate {
  month: string
  lead_to_qualified: number
  qualified_to_proposal: number
  proposal_to_negotiation: number
  negotiation_to_closed: number
}

// REAL — derived from the 2024 partner-platform export by
// scripts/derive-partner-metrics.ts.
//
// The previous version listed five stages (Leads -> Qualified -> Proposal ->
// Negotiation -> Closed Won) with 12,650 leads. The source `deal_stage` field
// only ever carries three values, so those intermediate stages and their counts
// were invented. This is the funnel that actually exists.
export const initialFunnelStages: FunnelStage[] = partnerProgramMetrics.dealFunnel.map((s) => ({
  name: s.stage,
  count: s.count,
  avg_deal_size: s.avgAmountUsd,
}))

// REAL — median days from deal creation to close, per partner tier. Tiers with
// fewer than 5 closed deals are omitted rather than shown on thin evidence.
export const initialPartnerConversion: PartnerConversion[] = partnerProgramMetrics.partnerTiers
  .filter((t) => t.medianDaysToClose > 0)
  .map((t) => ({ group: t.tier, median_days_to_close: t.medianDaysToClose }))
  .sort((a, b) => a.median_days_to_close - b.median_days_to_close)

// ILLUSTRATIVE — NOT derived. The export is a point-in-time snapshot with no
// stage-transition history, so quarter-over-quarter conversion between stages
// cannot be computed from it. These figures model the shape of the analysis;
// the UI labels them as illustrative via <DataProvenance variant="illustrative" />.
export const initialConversionRates: ConversionRate[] = [
  {
    month: 'Q1',
    lead_to_qualified: 58.4,
    qualified_to_proposal: 62.2,
    proposal_to_negotiation: 62.0,
    negotiation_to_closed: 83.2,
  },
  {
    month: 'Q2',
    lead_to_qualified: 57.9,
    qualified_to_proposal: 61.8,
    proposal_to_negotiation: 61.4,
    negotiation_to_closed: 82.8,
  },
  {
    month: 'Q3',
    lead_to_qualified: 59.1,
    qualified_to_proposal: 62.7,
    proposal_to_negotiation: 62.3,
    negotiation_to_closed: 83.6,
  },
  {
    month: 'Q4',
    lead_to_qualified: 60.8,
    qualified_to_proposal: 64.3,
    proposal_to_negotiation: 63.9,
    negotiation_to_closed: 85.4,
  },
]
