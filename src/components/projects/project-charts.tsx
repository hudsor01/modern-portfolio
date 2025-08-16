'use client'

import { useState, useEffect } from 'react'

// Chart components
import {
  ChurnLineChart,
  RetentionHeatmap,
  RevenueBarChart,
  RevenueLineChart,
  TopPartnersChart,
  PartnerGroupPieChart,
  DealStageFunnelChart,
  LeadSourcePieChart
} from './charts/chart-imports'

// Chart layout components
import { ChartContainer } from './charts/chart-container'
import { InsightsSection } from './charts/insights-section'
import { LoadingState } from './charts/loading-state'
import { DefaultChartFallback } from './charts/default-chart-fallback'

interface ProjectChartsProps {
  projectId: string
}

export function ProjectCharts({ projectId }: ProjectChartsProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Deterministic chart bar heights to prevent hydration mismatch
  const chartBarHeights = [85, 92, 78, 95, 88, 82, 90, 76, 93, 87, 91, 89]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <LoadingState />
  }

  if (projectId === 'churn-retention') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          <ChartContainer
            title="Monthly Churn Rate Trends"
            colorScheme="red"
            fallbackMessage="Loading churn data visualization..."
          >
            <ChurnLineChart />
          </ChartContainer>

          <ChartContainer
            title="Customer Retention Analytics"
            colorScheme="green"
            fallbackMessage="Loading retention analytics..."
          >
            <RetentionHeatmap />
          </ChartContainer>
        </div>

        <InsightsSection
          title="Key Insights from Analysis"
          colorScheme="blue"
          metrics={[
            { value: "92%", label: "Prediction Accuracy", color: "text-green-400" },
            { value: "25%", label: "Churn Reduction", color: "text-blue-400" },
            { value: "$800K", label: "Revenue Saved", color: "text-purple-400" }
          ]}
        />
      </div>
    )
  }

  if (projectId === 'revenue-kpi') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartContainer
            title="Revenue Growth Trends"
            colorScheme="green"
            fallbackMessage="Loading revenue trends..."
          >
            <RevenueLineChart />
          </ChartContainer>

          <ChartContainer
            title="Monthly Revenue Analysis"
            colorScheme="blue"
            fallbackMessage="Loading revenue analytics..."
          >
            <RevenueBarChart />
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartContainer
            title="Top Revenue Partners"
            colorScheme="purple"
            fallbackMessage="Loading partner analytics..."
          >
            <TopPartnersChart />
          </ChartContainer>

          <ChartContainer
            title="Partner Distribution"
            colorScheme="orange"
            fallbackMessage="Loading partner distribution..."
          >
            <PartnerGroupPieChart />
          </ChartContainer>
        </div>

        <InsightsSection
          title="Key Revenue Insights"
          colorScheme="yellow"
          metrics={[
            { value: "$1.2M", label: "Additional Revenue", color: "text-green-400" },
            { value: "95%", label: "Forecast Accuracy", color: "text-blue-400" },
            { value: "40%", label: "Time Saved", color: "text-purple-400" },
            { value: "100%", label: "Real-time Data", color: "text-cyan-400" }
          ]}
        />
      </div>
    )
  }

  if (projectId === 'deal-funnel') {
    return (
      <div className="space-y-8">
        <ChartContainer
          title="Sales Pipeline Analysis"
          colorScheme="purple"
          fallbackMessage="Loading funnel analysis..."
        >
          <DealStageFunnelChart stages={[
            { name: 'Leads', count: 1000, avg_deal_size: 0 },
            { name: 'Qualified', count: 750, avg_deal_size: 15000 },
            { name: 'Proposal', count: 500, avg_deal_size: 18000 },
            { name: 'Negotiation', count: 300, avg_deal_size: 22000 },
            { name: 'Closed Won', count: 200, avg_deal_size: 25000 }
          ]} />
        </ChartContainer>

        <InsightsSection
          title="Sales Funnel Performance"
          colorScheme="blue"
          metrics={[
            { value: "+35%", label: "Conversion Rate", color: "text-green-400" },
            { value: "+60%", label: "Sales Velocity", color: "text-purple-400" },
            { value: "+20%", label: "Average Deal Size", color: "text-orange-400" }
          ]}
        />
      </div>
    )
  }

  if (projectId === 'lead-attribution') {
    return (
      <div className="space-y-8">
        <ChartContainer
          title="Marketing Attribution Analysis"
          colorScheme="orange"
          fallbackMessage="Loading lead attribution..."
        >
          <LeadSourcePieChart />
        </ChartContainer>

        <InsightsSection
          title="Attribution Performance"
          colorScheme="green"
          metrics={[
            { value: "88%", label: "Attribution Accuracy", color: "text-blue-400" },
            { value: "+45%", label: "ROAS Improvement", color: "text-green-400" },
            { value: "+30%", label: "Campaign Efficiency", color: "text-purple-400" }
          ]}
        />
      </div>
    )
  }

  // Default fallback for other projects
  return <DefaultChartFallback chartBarHeights={chartBarHeights} />
}
