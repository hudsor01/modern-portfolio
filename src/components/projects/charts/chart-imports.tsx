import dynamic from 'next/dynamic'

// Chart loading fallback component
const ChartLoader = ({ message }: { message: string }) => (
  <div className="h-64 flex items-center justify-center text-gray-400">
    {message}
  </div>
)

// Dynamically import chart components to avoid SSR issues
export const ChurnLineChart = dynamic(() => import('@/app/projects/churn-retention/ChurnLineChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading churn trends..." />
})

export const RetentionHeatmap = dynamic(() => import('@/app/projects/churn-retention/RetentionHeatmap'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading retention analytics..." />
})

// Revenue KPI Charts
export const RevenueBarChart = dynamic(() => import('@/app/projects/revenue-kpi/RevenueBarChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading revenue analytics..." />
})

export const RevenueLineChart = dynamic(() => import('@/app/projects/revenue-kpi/RevenueLineChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading revenue trends..." />
})

export const TopPartnersChart = dynamic(() => import('@/app/projects/revenue-kpi/TopPartnersChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading partner analytics..." />
})

export const PartnerGroupPieChart = dynamic(() => import('@/app/projects/revenue-kpi/PartnerGroupPieChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading partner distribution..." />
})

// Deal Funnel Charts
export const DealStageFunnelChart = dynamic(() => import('@/app/projects/deal-funnel/DealStageFunnelChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading funnel analysis..." />
})

// Lead Attribution Charts
export const LeadSourcePieChart = dynamic(() => import('@/app/projects/lead-attribution/LeadSourcePieChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading lead attribution..." />
})

// Customer Lifetime Value Charts
export const CLVPredictionChart = dynamic(() => import('@/app/projects/customer-lifetime-value/CLVPredictionChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading CLV predictions..." />
})

export const CustomerSegmentChart = dynamic(() => import('@/app/projects/customer-lifetime-value/CustomerSegmentChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading customer segments..." />
})

export const CLVTrendChart = dynamic(() => import('@/app/projects/customer-lifetime-value/CLVTrendChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading CLV trends..." />
})

// Commission Optimization Charts
export const CommissionStructureChart = dynamic(() => import('@/app/projects/commission-optimization/CommissionStructureChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading commission structure..." />
})

export const PerformanceIncentiveChart = dynamic(() => import('@/app/projects/commission-optimization/PerformanceIncentiveChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading incentive analysis..." />
})

export const ROIOptimizationChart = dynamic(() => import('@/app/projects/commission-optimization/ROIOptimizationChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading ROI optimization..." />
})

export const CommissionTierChart = dynamic(() => import('@/app/projects/commission-optimization/CommissionTierChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading commission tiers..." />
})

// Multi-Channel Attribution Charts
export const AttributionModelChart = dynamic(() => import('@/app/projects/multi-channel-attribution/AttributionModelChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading attribution models..." />
})

export const CustomerJourneyChart = dynamic(() => import('@/app/projects/multi-channel-attribution/CustomerJourneyChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading customer journey..." />
})

export const ChannelROIChart = dynamic(() => import('@/app/projects/multi-channel-attribution/ChannelROIChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading channel ROI..." />
})

export const TouchpointAnalysisChart = dynamic(() => import('@/app/projects/multi-channel-attribution/TouchpointAnalysisChart'), {
  ssr: false,
  loading: () => <ChartLoader message="Loading touchpoint analysis..." />
})