export const starData = {
  situation: { phase: 'Situation', impact: 29, efficiency: 24, value: 19 },
  task: { phase: 'Task', impact: 54, efficiency: 49, value: 44 },
  action: { phase: 'Action', impact: 83, efficiency: 87, value: 79 },
  result: { phase: 'Result', impact: 98, efficiency: 96, value: 94 },
}

export interface FunnelStage {
  name: string
  count: number
  avg_deal_size: number
}

export interface PartnerConversion {
  group: string
  avg_sales_cycle_days: number
}

export interface ConversionRate {
  month: string
  lead_to_qualified: number
  qualified_to_proposal: number
  proposal_to_negotiation: number
  negotiation_to_closed: number
}

export const initialFunnelStages: FunnelStage[] = [
  { name: 'Leads', count: 12650, avg_deal_size: 0 },
  { name: 'Qualified', count: 7384, avg_deal_size: 285 },
  { name: 'Proposal', count: 4592, avg_deal_size: 312 },
  { name: 'Negotiation', count: 2847, avg_deal_size: 328 },
  { name: 'Closed Won', count: 2368, avg_deal_size: 305 },
]

export const initialPartnerConversion: PartnerConversion[] = [
  { group: 'Certified Partners', avg_sales_cycle_days: 73 },
  { group: 'Legacy Partners', avg_sales_cycle_days: 89 },
  { group: 'Inactive Partners', avg_sales_cycle_days: 126 },
]

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

export const technologies = [
  'React 19', 'TypeScript', 'Recharts', 'Sales Analytics',
  'Pipeline Management', 'Conversion Tracking', 'Velocity Analysis', 'Funnel Optimization',
  'CRM Integration', 'Real-time Dashboards', 'Mobile Design', 'Performance Metrics'
]
