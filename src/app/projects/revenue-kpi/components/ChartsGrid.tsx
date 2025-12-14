'use client'

import dynamic from 'next/dynamic'


const RevenueBarChart = dynamic(() => import('../RevenueBarChart'), { ssr: false })
const RevenueLineChart = dynamic(() => import('../RevenueLineChart'), { ssr: false })
const TopPartnersChart = dynamic(() => import('../TopPartnersChart'), { ssr: false })
const PartnerGroupPieChart = dynamic(() => import('../PartnerGroupPieChart'), { ssr: false })

export function ChartsGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Trends */}
      <div
        className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="typography-h4 mb-1">Revenue Growth Trends</h2>
          <p className="typography-small text-muted-foreground">
            Monthly revenue progression and forecasting
          </p>
        </div>
        <div className="h-[200px]">
          <RevenueLineChart />
        </div>
      </div>

      {/* Revenue Distribution */}
      <div
        className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="typography-h4 mb-1">Monthly Revenue Analysis</h2>
          <p className="typography-small text-muted-foreground">Revenue breakdown by time period</p>
        </div>
        <div className="h-[200px]">
          <RevenueBarChart />
        </div>
      </div>

      {/* Top Partners */}
      <div
        className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="typography-h4 mb-1">Top Revenue Partners</h2>
          <p className="typography-small text-muted-foreground">Highest performing business partners</p>
        </div>
        <div className="h-[200px]">
          <TopPartnersChart />
        </div>
      </div>

      {/* Partner Distribution */}
      <div
        className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="typography-h4 mb-1">Partner Group Distribution</h2>
          <p className="typography-small text-muted-foreground">Revenue contribution by partner type</p>
        </div>
        <div className="h-[200px]">
          <PartnerGroupPieChart />
        </div>
      </div>
    </div>
  )
}
