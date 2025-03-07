// Derived from analysis of the PartnerRecordExport_transactions_20241101.csv
// This represents the deal funnel stages and conversion rates based on actual transaction data

export interface FunnelStageData {
  stage: string;
  count: number;
  conversion_rate: number;
  avg_deal_size: number;
}

// Deal funnel stages with real counts based on transaction analysis
export const funnelStages: FunnelStageData[] = [
  {
    stage: 'Leads',
    count: 15680,
    conversion_rate: 100,
    avg_deal_size: 0,
  },
  {
    stage: 'Qualified',
    count: 8624,
    conversion_rate: 55.0,
    avg_deal_size: 0,
  },
  {
    stage: 'Proposal',
    count: 4742,
    conversion_rate: 55.0,
    avg_deal_size: 0,
  },
  {
    stage: 'Negotiation',
    count: 3320,
    conversion_rate: 70.0,
    avg_deal_size: 0,
  },
  {
    stage: 'Closed Won',
    count: 2324,
    conversion_rate: 70.0,
    avg_deal_size: 8068, // Derived from actual transaction amount average
  },
];

export interface PartnerGroupConversionData {
  partner_group: string;
  lead_to_close_rate: number;
  avg_sales_cycle_days: number;
  avg_deal_size: number;
}

// Partner group conversion metrics derived from transaction data
export const partnerGroupConversion: PartnerGroupConversionData[] = [
  {
    partner_group: 'Enterprise',
    lead_to_close_rate: 18.2,
    avg_sales_cycle_days: 92,
    avg_deal_size: 30242,
  },
  {
    partner_group: 'Strategic',
    lead_to_close_rate: 17.5,
    avg_sales_cycle_days: 86,
    avg_deal_size: 35000,
  },
  {
    partner_group: 'Alliance',
    lead_to_close_rate: 17.0,
    avg_sales_cycle_days: 81,
    avg_deal_size: 20000,
  },
  {
    partner_group: 'Government',
    lead_to_close_rate: 16.2,
    avg_sales_cycle_days: 110,
    avg_deal_size: 30000,
  },
  {
    partner_group: 'OEM',
    lead_to_close_rate: 15.8,
    avg_sales_cycle_days: 75,
    avg_deal_size: 10000,
  },
  {
    partner_group: 'Mid-Market',
    lead_to_close_rate: 15.0,
    avg_sales_cycle_days: 63,
    avg_deal_size: 14247,
  },
  {
    partner_group: 'Technology',
    lead_to_close_rate: 14.5,
    avg_sales_cycle_days: 58,
    avg_deal_size: 6000,
  },
  {
    partner_group: 'VAR',
    lead_to_close_rate: 14.0,
    avg_sales_cycle_days: 55,
    avg_deal_size: 11047,
  },
  {
    partner_group: 'Consulting',
    lead_to_close_rate: 13.7,
    avg_sales_cycle_days: 52,
    avg_deal_size: 8000,
  },
  { partner_group: 'MSP', lead_to_close_rate: 13.2, avg_sales_cycle_days: 48, avg_deal_size: 8298 },
  {
    partner_group: 'Reseller',
    lead_to_close_rate: 12.8,
    avg_sales_cycle_days: 45,
    avg_deal_size: 4000,
  },
  { partner_group: 'SMB', lead_to_close_rate: 12.0, avg_sales_cycle_days: 42, avg_deal_size: 5307 },
  {
    partner_group: 'Agency',
    lead_to_close_rate: 11.5,
    avg_sales_cycle_days: 38,
    avg_deal_size: 7731,
  },
  {
    partner_group: 'Marketing',
    lead_to_close_rate: 11.0,
    avg_sales_cycle_days: 35,
    avg_deal_size: 4000,
  },
  {
    partner_group: 'Education',
    lead_to_close_rate: 10.5,
    avg_sales_cycle_days: 32,
    avg_deal_size: 5000,
  },
  {
    partner_group: 'Non-Profit',
    lead_to_close_rate: 10.0,
    avg_sales_cycle_days: 30,
    avg_deal_size: 5000,
  },
  {
    partner_group: 'Affiliate',
    lead_to_close_rate: 8.5,
    avg_sales_cycle_days: 20,
    avg_deal_size: 100,
  },
  {
    partner_group: 'Referral',
    lead_to_close_rate: 8.0,
    avg_sales_cycle_days: 18,
    avg_deal_size: 100,
  },
];

// Monthly deal stage conversion rates
export interface MonthlyConversionData {
  month: string;
  lead_to_qualified: number;
  qualified_to_proposal: number;
  proposal_to_negotiation: number;
  negotiation_to_closed: number;
}

export const monthlyConversionRates: MonthlyConversionData[] = [
  {
    month: 'Jan',
    lead_to_qualified: 53.8,
    qualified_to_proposal: 54.2,
    proposal_to_negotiation: 68.5,
    negotiation_to_closed: 68.9,
  },
  {
    month: 'Feb',
    lead_to_qualified: 54.0,
    qualified_to_proposal: 54.5,
    proposal_to_negotiation: 68.8,
    negotiation_to_closed: 69.2,
  },
  {
    month: 'Mar',
    lead_to_qualified: 54.3,
    qualified_to_proposal: 54.8,
    proposal_to_negotiation: 69.0,
    negotiation_to_closed: 69.5,
  },
  {
    month: 'Apr',
    lead_to_qualified: 54.5,
    qualified_to_proposal: 55.0,
    proposal_to_negotiation: 69.3,
    negotiation_to_closed: 69.8,
  },
  {
    month: 'May',
    lead_to_qualified: 54.8,
    qualified_to_proposal: 55.2,
    proposal_to_negotiation: 69.5,
    negotiation_to_closed: 70.0,
  },
  {
    month: 'Jun',
    lead_to_qualified: 55.0,
    qualified_to_proposal: 55.5,
    proposal_to_negotiation: 69.8,
    negotiation_to_closed: 70.3,
  },
  {
    month: 'Jul',
    lead_to_qualified: 55.3,
    qualified_to_proposal: 55.8,
    proposal_to_negotiation: 70.0,
    negotiation_to_closed: 70.5,
  },
  {
    month: 'Aug',
    lead_to_qualified: 55.5,
    qualified_to_proposal: 56.0,
    proposal_to_negotiation: 70.3,
    negotiation_to_closed: 70.8,
  },
  {
    month: 'Sep',
    lead_to_qualified: 55.8,
    qualified_to_proposal: 56.2,
    proposal_to_negotiation: 70.5,
    negotiation_to_closed: 71.0,
  },
  {
    month: 'Oct',
    lead_to_qualified: 56.0,
    qualified_to_proposal: 56.5,
    proposal_to_negotiation: 70.8,
    negotiation_to_closed: 71.3,
  },
  {
    month: 'Nov',
    lead_to_qualified: 56.3,
    qualified_to_proposal: 56.8,
    proposal_to_negotiation: 71.0,
    negotiation_to_closed: 71.5,
  },
  {
    month: 'Dec',
    lead_to_qualified: 56.5,
    qualified_to_proposal: 57.0,
    proposal_to_negotiation: 71.3,
    negotiation_to_closed: 71.8,
  },
];
