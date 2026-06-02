// ============================================================================
// Data Service Types (from lib/analytics/data-service.ts)
// ============================================================================

interface BaseAnalyticsData {
  id: string
  timestamp: Date
  source: 'generated' | 'real' | 'cached'
  metadata?: Record<string, unknown>
}

export interface ChurnAnalyticsData extends BaseAnalyticsData {
  month: string
  churn_rate: number
  retained_partners: number
  churned_partners: number
  new_partners: number
  recovery_rate: number
}

export interface LeadAttributionData extends BaseAnalyticsData {
  channel: string
  leads: number
  qualified: number
  closed: number
  revenue: number
  cost_per_lead: number
  conversion_rate: number
  roi: number
}

export interface LeadTrendData extends BaseAnalyticsData {
  month: string
  leads: number
  conversions: number
  conversion_rate: number
}

export interface GrowthData extends BaseAnalyticsData {
  quarter: string
  revenue: number
  partners: number
  deals: number
  growth_rate: number
  target_achievement: number
}

export interface YearOverYearData extends BaseAnalyticsData {
  year: number
  total_revenue: number
  total_transactions: number
  total_commissions: number
  partner_count: number
  commission_growth_percentage: number
  growth_percentage: number
  market_share: number
}

export interface TopPartnerData extends BaseAnalyticsData {
  name: string
  revenue: number
  deals: number
  commission: number
  tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  satisfaction_score: number
  retention_probability: number
}

export interface AllAnalyticsDataBundle {
  churn: ChurnAnalyticsData[]
  leadAttribution: LeadAttributionData[]
  leadTrends: LeadTrendData[]
  growth: GrowthData[]
  yearOverYear: YearOverYearData[]
  topPartners: TopPartnerData[]
}
