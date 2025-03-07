export interface TopPartner {
  partner_name: string;
  total_sum_of_transactions_usd: number;
}

// Data from Top_5_Partners_by_Total_Revenue.csv
export const topPartnersByRevenue: TopPartner[] = [
  {
    partner_name: "TechCorp Inc.",
    total_sum_of_transactions_usd: 2850000
  },
  {
    partner_name: "GrowthMetrics",
    total_sum_of_transactions_usd: 1950000
  },
  {
    partner_name: "ScaleUp Solutions",
    total_sum_of_transactions_usd: 1750000
  },
  {
    partner_name: "Digital Partners Global",
    total_sum_of_transactions_usd: 1250000
  },
  {
    partner_name: "NextGen Consulting",
    total_sum_of_transactions_usd: 950000
  }
];