'use client'


import { TrendingUp } from 'lucide-react'
import { predictiveMetrics } from '../data/constants'

export function PredictionsTab() {
  return (
    <div
      className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
    >
      <div className="mb-4">
        <h2 className="typography-h4 mb-1">Real-Time Predictive Analytics Dashboard</h2>
        <p className="typography-small text-muted-foreground">Advanced machine learning predictions for customer behavior and purchase patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {predictiveMetrics.map((metric, index) => (
          <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">{metric.metric}</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="typography-large mb-1">{metric.value}</p>
                <p className={`text-xs ${metric.color} flex items-center gap-1`}>
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
