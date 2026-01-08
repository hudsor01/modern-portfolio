export interface MonthlyChurnEntry {
  month: string
  churn_rate: number
  retained_partners: number
  churned_partners: number
}

export interface LeadAttributionEntry {
  source: string
  leads: number
  qualified: number
  closed: number
  revenue: number
}

export interface GrowthEntry {
  quarter: string
  revenue: number
  partners: number
  deals: number
}

export interface YearOverYearGrowthEntry {
  year: number
  total_revenue: number
  total_transactions: number
  total_commissions: number
}

export interface TopPartnerEntry {
  name: string
  revenue: number
  deals: number
  commission: number
}

// ============================================================================
// Web Vitals Types (from lib/analytics/web-vitals-service.ts)
// ============================================================================

export interface WebVitalsData {
  id: string
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP'
  value: number
  rating?: 'good' | 'needs-improvement' | 'poor'
  delta?: number
  entries?: unknown[]
  navigationType?: 'navigate' | 'reload' | 'back-forward' | 'prerender'
  url?: string
  userAgent?: string
  timestamp?: number
}

export interface EnhancedWebVitalsData extends WebVitalsData {
  sessionId: string
  userId?: string
  page: string
  device: DeviceInfo
  connection: ConnectionInfo
  timestamp: number
  buildId?: string
  version?: string
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop'
  os?: string
  browser?: string
  viewport: {
    width: number
    height: number
  }
}

export interface ConnectionInfo {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

export const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
} as const

export interface AnalyticsStorage {
  store(data: EnhancedWebVitalsData): Promise<void>
  query(filters: AnalyticsQueryFilters): Promise<AnalyticsQueryResult[]>
  aggregate(timeRange: TimeRange, groupBy?: string): Promise<AnalyticsAggregation>
  destroy?(): void
}

export interface AnalyticsQueryFilters {
  startDate?: Date
  endDate?: Date
  page?: string
  metric?: WebVitalsData['name']
  device?: DeviceInfo['type']
  rating?: 'good' | 'needs-improvement' | 'poor'
  limit?: number
}

export interface AnalyticsQueryResult extends EnhancedWebVitalsData {}

export interface AnalyticsAggregation {
  totalSamples: number
  averageValue: number
  medianValue: number
  p75Value: number
  p95Value: number
  ratingDistribution: {
    good: number
    needsImprovement: number
    poor: number
  }
  byPage: Record<string, GroupedAnalyticsResult>
  byDevice: Record<string, GroupedAnalyticsResult>
}

export interface GroupedAnalyticsResult {
  samples: number
  average: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

export interface TimeRange {
  start: Date
  end: Date
}

export interface PerformanceAlert {
  type: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  metrics: AnalyticsQueryResult[]
}

// ============================================================================
// Data Service Types (from lib/analytics/data-service.ts)
// ============================================================================

export interface BaseAnalyticsData {
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
