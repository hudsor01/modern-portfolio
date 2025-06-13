'use client'

import { Card } from '@/components/ui/card'
import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string
  icon: React.ReactNode
  trend?: string
}

function KPICard({ label, value, icon, trend }: KPICardProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
      <div className="text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground truncate">{label}</div>
        <div className="text-sm font-medium">{value}</div>
        {trend && (
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="h-2.5 w-2.5" />
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Production-ready revenue dashboard preview component for project showcase
 * Features interactive elements and realistic data visualization
 * Designed for portfolio presentation contexts
 */
export function RevenueDashboardPreview() {
  const kpis = [
    {
      label: "Monthly Revenue",
      value: "$284K",
      icon: <DollarSign className="h-4 w-4" />,
      trend: "+18.2%"
    },
    {
      label: "Active Users",
      value: "1.2K",
      icon: <Activity className="h-4 w-4" />,
      trend: "+7.5%"
    }
  ]

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-muted/20 p-4">
      <Card className="w-full max-w-md p-4 shadow-xl border-2 bg-card/90 backdrop-blur">
        {/* Header with animated title */}
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary animate-pulse" />
          <div className="space-y-1">
            <div className="h-4 w-32 bg-primary/40 rounded animate-pulse"></div>
            <div className="text-xs text-muted-foreground">Analytics Dashboard</div>
          </div>
        </div>

        {/* Main chart area with animated bars */}
        <div className="mb-4 h-28 rounded-lg bg-gradient-to-t from-primary/5 to-primary/15 p-3 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="flex items-end justify-between h-full gap-1">
            {[34, 52, 41, 68, 55, 73, 59, 81, 67, 89, 76, 92].map((height, i) => (
              <div
                key={i}
                className="bg-primary/60 rounded-t transition-all duration-1000 ease-out"
                style={{ 
                  height: `${height}%`,
                  animationDelay: `${i * 100}ms`,
                  width: '100%'
                }}
              ></div>
            ))}
          </div>
          <div className="absolute top-2 right-2 text-xs text-muted-foreground">
            2024 Growth
          </div>
        </div>

        {/* KPI Cards */}
        <div className="space-y-2 mb-4">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Footer with status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <span>Real-time Analytics</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
