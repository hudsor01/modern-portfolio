export interface YearOverYearGrowth {
  year: number;
  partner_count: number;
  partner_growth_percentage: number;
  total_partner_growth: number;
  total_transactions: number;
  total_revenue: number;
  transaction_growth_percentage: number;
  revenue_growth_percentage: number;
  total_transaction_growth: number;
  total_revenue_growth: number;
  total_commissions: number;
  commission_growth_percentage: number;
  total_commission_growth: number;
}

// Data from Year_Over_Year_Growth_Summary.csv
export const yearOverYearGrowth: YearOverYearGrowth[] = [
  {
    year: 2020,
    partner_count: 235,
    partner_growth_percentage: 0,
    total_partner_growth: 0,
    total_transactions: 5300,
    total_revenue: 5900000,
    transaction_growth_percentage: 0,
    revenue_growth_percentage: 0,
    total_transaction_growth: 0,
    total_revenue_growth: 0,
    total_commissions: 590000,
    commission_growth_percentage: 0,
    total_commission_growth: 0,
  },
  {
    year: 2021,
    partner_count: 312,
    partner_growth_percentage: 32.8,
    total_partner_growth: 77,
    total_transactions: 7800,
    total_revenue: 8500000,
    transaction_growth_percentage: 47.2,
    revenue_growth_percentage: 44.1,
    total_transaction_growth: 2500,
    total_revenue_growth: 2600000,
    total_commissions: 850000,
    commission_growth_percentage: 44.1,
    total_commission_growth: 260000,
  },
  {
    year: 2022,
    partner_count: 425,
    partner_growth_percentage: 36.2,
    total_partner_growth: 113,
    total_transactions: 14200,
    total_revenue: 12800000,
    transaction_growth_percentage: 82.1,
    revenue_growth_percentage: 50.6,
    total_transaction_growth: 6400,
    total_revenue_growth: 4300000,
    total_commissions: 1280000,
    commission_growth_percentage: 50.6,
    total_commission_growth: 430000,
  },
  {
    year: 2023,
    partner_count: 580,
    partner_growth_percentage: 36.5,
    total_partner_growth: 155,
    total_transactions: 20500,
    total_revenue: 16850000,
    transaction_growth_percentage: 44.4,
    revenue_growth_percentage: 31.6,
    total_transaction_growth: 6300,
    total_revenue_growth: 4050000,
    total_commissions: 1685000,
    commission_growth_percentage: 31.6,
    total_commission_growth: 405000,
  },
  {
    year: 2024,
    partner_count: 735,
    partner_growth_percentage: 26.7,
    total_partner_growth: 155,
    total_transactions: 27500,
    total_revenue: 18750000,
    transaction_growth_percentage: 34.1,
    revenue_growth_percentage: 11.3,
    total_transaction_growth: 7000,
    total_revenue_growth: 1900000,
    total_commissions: 1875000,
    commission_growth_percentage: 11.3,
    total_commission_growth: 190000,
  },
];
