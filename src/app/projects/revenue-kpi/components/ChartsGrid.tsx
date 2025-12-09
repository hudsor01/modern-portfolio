'use client'

import dynamic from 'next/dynamic'
import { m as motion } from 'framer-motion'

const RevenueBarChart = dynamic(() => import('../RevenueBarChart'), { ssr: false })
const RevenueLineChart = dynamic(() => import('../RevenueLineChart'), { ssr: false })
const TopPartnersChart = dynamic(() => import('../TopPartnersChart'), { ssr: false })
const PartnerGroupPieChart = dynamic(() => import('../PartnerGroupPieChart'), { ssr: false })

export function ChartsGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Revenue Growth Trends</h2>
          <p className="text-sm text-muted-foreground">
            Monthly revenue progression and forecasting
          </p>
        </div>
        <div className="h-[200px]">
          <RevenueLineChart />
        </div>
      </motion.div>

      {/* Revenue Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Monthly Revenue Analysis</h2>
          <p className="text-sm text-muted-foreground">Revenue breakdown by time period</p>
        </div>
        <div className="h-[200px]">
          <RevenueBarChart />
        </div>
      </motion.div>

      {/* Top Partners */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Top Revenue Partners</h2>
          <p className="text-sm text-muted-foreground">Highest performing business partners</p>
        </div>
        <div className="h-[200px]">
          <TopPartnersChart />
        </div>
      </motion.div>

      {/* Partner Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Partner Group Distribution</h2>
          <p className="text-sm text-muted-foreground">Revenue contribution by partner type</p>
        </div>
        <div className="h-[200px]">
          <PartnerGroupPieChart />
        </div>
      </motion.div>
    </div>
  )
}
