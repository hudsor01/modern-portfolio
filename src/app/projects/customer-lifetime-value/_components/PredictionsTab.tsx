'use client'

import { TrendingUp } from 'lucide-react'
import { predictiveMetrics } from '../data/constants'
import { ChartHeader } from '@/components/ui/chart-container'

export function PredictionsTab() {
  return (
    <div className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out mb-8">
      <ChartHeader
        title="Real-Time Predictive Analytics Dashboard"
        description="Advanced machine learning predictions for customer behavior and purchase patterns"
        headingLevel={2}
        className="mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {predictiveMetrics.map((metric, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="mb-2">{metric.metric}</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="typography-large mb-1">{metric.value}</p>
                <p className={` ${metric.color} flex items-center gap-1`}>
                  <TrendingUp className="w-3 h-3" />
                  {metric.trend}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
