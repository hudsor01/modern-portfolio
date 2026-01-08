// Partner Analytics Data for Portfolio Project
// This is sample data for demonstration purposes

export interface PartnerGroup {
  name: string
  value: number
  color: string
}

export interface MonthlyRevenueData {
  month: string
  revenue: number
  target: number
}

export interface YearOverYearGrowthExtended {
  year: number
  total_revenue: number
  total_transactions: number
  total_commissions: number
  partner_count: number
  commission_growth_percentage: number
}

export interface TopPartnerData {
  name: string
  revenue: number
  deals: number
  growth: number
}

export interface PartnerAnalytics {
  id: string
  name: string
  revenue: number
  deals: number
  churnRate: number
  acquisitionCost: number
  lifetime_value: number
  region: string
  tier: string
  acquisition_date: string
}

export const partnerAnalyticsData: PartnerAnalytics[] = [
  {
    id: "partner-001",
    name: "TechCorp Solutions",
    revenue: 285000,
    deals: 12,
    churnRate: 0.05,
    acquisitionCost: 1250,
    lifetime_value: 45000,
    region: "North America",
    tier: "Enterprise",
    acquisition_date: "2023-01-15"
  },
  {
    id: "partner-002", 
    name: "Global Innovations",
    revenue: 195000,
    deals: 8,
    churnRate: 0.12,
    acquisitionCost: 980,
    lifetime_value: 32000,
    region: "Europe",
    tier: "Premium",
    acquisition_date: "2023-03-22"
  },
  {
    id: "partner-003",
    name: "StartupBase",
    revenue: 125000,
    deals: 15,
    churnRate: 0.18,
    acquisitionCost: 650,
    lifetime_value: 18000,
    region: "Asia Pacific",
    tier: "Standard",
    acquisition_date: "2023-05-10"
  }
]

export const retentionData = [
  { month: "Jan 2024", retained: 95, churned: 5 },
  { month: "Feb 2024", retained: 92, churned: 8 },
  { month: "Mar 2024", retained: 88, churned: 12 },
  { month: "Apr 2024", retained: 90, churned: 10 },
  { month: "May 2024", retained: 94, churned: 6 },
  { month: "Jun 2024", retained: 91, churned: 9 }
]

export const leadAttributionData = [
  { source: "Organic Search", leads: 150, conversion: 0.12 },
  { source: "Paid Social", leads: 95, conversion: 0.08 },
  { source: "Email Marketing", leads: 120, conversion: 0.15 },
  { source: "Direct Traffic", leads: 80, conversion: 0.18 },
  { source: "Referrals", leads: 65, conversion: 0.22 }
]

export const staticChurnData = [
  { month: "Jan 2024", churnRate: 5.2, cohortSize: 100, churned: 5, retained: 95 },
  { month: "Feb 2024", churnRate: 4.8, cohortSize: 105, churned: 5, retained: 100 },
  { month: "Mar 2024", churnRate: 6.1, cohortSize: 98, churned: 6, retained: 92 },
  { month: "Apr 2024", churnRate: 3.9, cohortSize: 102, churned: 4, retained: 98 },
  { month: "May 2024", churnRate: 4.2, cohortSize: 108, churned: 5, retained: 103 },
  { month: "Jun 2024", churnRate: 3.5, cohortSize: 110, churned: 4, retained: 106 }
]

export const dealFunnelData = [
  { stage: "Leads", value: 1000, conversion: 100 },
  { stage: "Qualified", value: 400, conversion: 40 },
  { stage: "Proposal", value: 200, conversion: 20 },
  { stage: "Negotiation", value: 120, conversion: 12 },
  { stage: "Closed Won", value: 80, conversion: 8 }
]

export const revenueKpiData = [
  { month: "Jan", revenue: 150000, target: 140000, growth: 12.5 },
  { month: "Feb", revenue: 165000, target: 145000, growth: 15.2 },
  { month: "Mar", revenue: 178000, target: 150000, growth: 18.7 },
  { month: "Apr", revenue: 185000, target: 155000, growth: 19.4 },
  { month: "May", revenue: 192000, target: 160000, growth: 20.0 },
  { month: "Jun", revenue: 205000, target: 165000, growth: 24.2 }
]

export const partnerGroupsData = [
  { name: "Enterprise", value: 65, color: "var(--color-chart-1)" },
  { name: "Mid-Market", value: 25, color: "var(--color-chart-2)" },
  { name: "SMB", value: 10, color: "var(--color-chart-3)" }
]

export const monthlyRevenue2024 = [
  { month: "Jan", revenue: 284000, target: 270000 },
  { month: "Feb", revenue: 298000, target: 285000 },
  { month: "Mar", revenue: 315000, target: 300000 },
  { month: "Apr", revenue: 332000, target: 320000 },
  { month: "May", revenue: 348000, target: 335000 },
  { month: "Jun", revenue: 365000, target: 350000 }
]

export const yearOverYearGrowthExtended = [
  {
    year: 2020,
    total_revenue: 2100000,
    total_transactions: 950,
    total_commissions: 210000,
    partner_count: 32,
    commission_growth_percentage: 0
  },
  {
    year: 2021,
    total_revenue: 2450000,
    total_transactions: 1050,
    total_commissions: 245000,
    partner_count: 37,
    commission_growth_percentage: 16.7
  },
  {
    year: 2022,
    total_revenue: 2850000,
    total_transactions: 1180,
    total_commissions: 285000,
    partner_count: 42,
    commission_growth_percentage: 16.3
  },
  {
    year: 2023,
    total_revenue: 3350000,
    total_transactions: 1350,
    total_commissions: 335000,
    partner_count: 48,
    commission_growth_percentage: 17.5
  },
  {
    year: 2024,
    total_revenue: 4250000,
    total_transactions: 1650,
    total_commissions: 425000,
    partner_count: 62,
    commission_growth_percentage: 26.9
  }
]

export const topPartnersData = [
  { name: "TechCorp Solutions", revenue: 85000, deals: 12, growth: 18.5 },
  { name: "Global Innovations", revenue: 72000, deals: 8, growth: 15.2 },
  { name: "Enterprise Systems", revenue: 68000, deals: 6, growth: 22.1 },
  { name: "Digital Partners", revenue: 54000, deals: 9, growth: 12.8 },
  { name: "Cloud Solutions", revenue: 48000, deals: 7, growth: 16.4 }
]
