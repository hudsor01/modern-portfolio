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