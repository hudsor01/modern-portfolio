export interface MonthlyChurnEntry {
  month: string;
  churn_rate: number;
  retained_partners: number;
  churned_partners: number;
}

export interface LeadAttributionEntry {
  source: string;
  leads: number;
  qualified: number;
  closed: number;
  revenue: number;
}

export interface GrowthEntry {
  quarter: string;
  revenue: number;
  partners: number;
  deals: number;
}

export interface YearOverYearGrowthEntry {
  year: number;
  total_revenue: number;
  total_transactions: number;
  total_commissions: number;
}

export interface TopPartnerEntry {
  name: string;
  revenue: number;
  deals: number;
  commission: number;
}
