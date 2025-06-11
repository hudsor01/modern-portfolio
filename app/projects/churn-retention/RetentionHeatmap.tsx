'use client'
import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts'
import { monthlyChurnData } from '@/app/projects/data/partner-analytics'

// Transform data for visualization
const data = monthlyChurnData.slice(0, 6).map((item) => ({
  month: item.month,
  retained: parseFloat(
    ((item.retained_partners / (item.retained_partners + item.churned_partners)) * 100).toFixed(1)
  ),
  churned: parseFloat(
    ((item.churned_partners / (item.retained_partners + item.churned_partners)) * 100).toFixed(1)
  ),
}))

// V4 Chart Colors using CSS Custom Properties
const chartColors = {
  success: 'hsl(var(--chart-3))',
  error: 'hsl(var(--destructive))',
  grid: 'hsl(var(--border))',
  axis: 'hsl(var(--muted-foreground))',
}

export default function RetentionHeatmap() {
  // Add client-side only rendering check
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="portfolio-card h-[300px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    )
  }
  return (
    <div className="portfolio-card">
      <h2 className="mb-4 text-xl font-semibold">
        Partner Retention & Churn (%)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            strokeOpacity={0.3} 
          />
          <XAxis
            dataKey="month"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
          />
          <YAxis
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            unit="%"
          />
          <Tooltip
            formatter={(value) => [`${value}%`, '']}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              boxShadow: 'var(--shadow-dark-lg)',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend />
          <Bar
            dataKey="retained"
            name="Retained"
            stackId="a"
            fill={chartColors.success}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
          <Bar
            dataKey="churned"
            name="Churned"
            stackId="a"
            fill={chartColors.error}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        First half of 2024 showing consistently high partner retention rates
      </p>
    </div>
  )
}
