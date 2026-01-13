'use client'


import { TrendingUp, TrendingDown } from 'lucide-react'
import { departmentMetrics } from '../data/constants'

export function OperationsTab() {
  return (
    <div
      className="space-y-8 mb-12"
    >
      {departmentMetrics.map((dept, index) => (
        <div key={index} className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out">
          <h3 className="typography-h4 mb-6">{dept.department} Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dept.metrics.map((metric, metricIndex) => (
              <div key={metricIndex} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="typography-small text-muted-foreground mb-2">{metric.name}</p>
                <p className="typography-h3 mb-1">{metric.value}</p>
                <p className={`text-sm flex items-center gap-1 ${
                  metric.positive ? 'text-success' : 'text-destructive'
                }`}>
                  {metric.positive ?
                    <TrendingUp className="w-4 h-4" /> :
                    <TrendingDown className="w-4 h-4" />
                  }
                  {metric.change}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
