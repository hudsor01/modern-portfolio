'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { growthData } from '@/app/projects/data/partner-analytics'

// Transform the real data for the bar chart
const data = growthData.map((quarterData) => ({
  quarter: quarterData.quarter,
  revenue: Math.round(quarterData.revenue / 1000000), // Convert to millions for readability
  partners: quarterData.partners,
  deals: quarterData.deals,
}))

// V4 Chart Colors using CSS Custom Properties
const chartColors = {
  primary: 'hsl(var(--chart-1))',
  grid: 'hsl(var(--border))',
  axis: 'hsl(var(--muted-foreground))',
}

export default function RevenueBarChart() {
  return (
    <div className="portfolio-card">
      <h2 className="mb-4 text-xl font-semibold">
        Annual Revenue (Millions USD)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            strokeOpacity={0.3} 
          />
          <XAxis
            dataKey="quarter"
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
            tickFormatter={(value) => `$${value}M`}
          />
          <Tooltip
            formatter={(value) => [`$${value}M`, 'Revenue']}
            labelFormatter={(year) => `Year: ${year}`}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              boxShadow: 'var(--shadow-dark-lg)',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Bar 
            dataKey="revenue" 
            fill={chartColors.primary} 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500} 
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Revenue growth from 2020-2024 showing steady increase year over year
      </p>
    </div>
  )
}
