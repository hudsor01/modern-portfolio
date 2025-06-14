'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react'

interface MetricCardProps {
  icon: React.ReactNode
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}

function MetricCard({ icon, title, value, change, trend }: MetricCardProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        <span className="truncate">{title}</span>
      </div>
      <div className="text-sm font-semibold">{value}</div>
      <div className={`text-xs flex items-center gap-0.5 ${
        trend === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        <TrendingUp className="h-2.5 w-2.5" />
        {change}
      </div>
    </div>
  )
}

/**
 * Production-ready revenue dashboard preview component
 * Displays realistic KPI metrics in a compact, visually appealing format
 * Optimized for preview contexts with proper responsive design
 */
export function RevenueDashboardPreview() {
  const metrics = [
    {
      icon: <DollarSign className="h-3 w-3" />,
      title: "Revenue",
      value: "$2.4M",
      change: "+12.5%",
      trend: 'up' as const
    },
    {
      icon: <Users className="h-3 w-3" />,
      title: "Partners",
      value: "380",
      change: "+8.2%",
      trend: 'up' as const
    },
    {
      icon: <BarChart3 className="h-3 w-3" />,
      title: "Growth",
      value: "24.3%",
      change: "+4.1%",
      trend: 'up' as const
    }
  ]

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4">
      <Card className="w-full max-w-sm p-4 shadow-lg border bg-card/95 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-4">
          <div className="h-3 w-20 bg-primary/40 rounded mb-2"></div>
          <div className="text-xs text-muted-foreground">Revenue Analytics</div>
        </div>

        {/* Chart placeholder with animated gradient */}
        <div className="relative mb-4 h-16 rounded bg-gradient-to-r from-primary/20 via-primary/30 to-primary/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="w-1 bg-primary/60 rounded-t"
                style={{ height: `${20 + Math.random() * 30}px` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Footer indicator */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Live Dashboard</span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>Updated</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
