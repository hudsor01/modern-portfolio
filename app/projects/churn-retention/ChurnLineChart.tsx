'use client'
import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import { monthlyChurnData } from '@/app/projects/data/partner-analytics'

// Transform data for visualization
const data = monthlyChurnData.map((item) => ({
  month: item.month,
  churn: item.churn_rate,
}))

// V4 Chart Colors using CSS Custom Properties
const chartColors = {
  error: 'hsl(var(--destructive))',
  grid: 'hsl(var(--border))',
  axis: 'hsl(var(--muted-foreground))',
}

export default function ChurnLineChart() {
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
        Monthly Churn Rate (%)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
            domain={[0, 'dataMax + 1']}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Churn Rate']}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              boxShadow: 'var(--shadow-dark-lg)',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="churn"
            stroke={chartColors.error}
            strokeWidth={2}
            dot={{ stroke: chartColors.error, strokeWidth: 2, r: 4, fill: 'hsl(var(--background))' }}
            activeDot={{ r: 6, stroke: chartColors.error, strokeWidth: 2, fill: chartColors.error }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Monthly partner churn rate showing stable retention with seasonal fluctuations
      </p>
    </div>
  )
}
