'use client'
import React, { memo, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { monthlyRevenue2024, type MonthlyRevenueData } from '@/app/projects/data/partner-analytics' // Corrected path

// V4 Chart Colors using CSS Custom Properties
const chartColors = {
  primary: 'hsl(var(--chart-1))',
  grid: 'hsl(var(--border))',
  axis: 'hsl(var(--muted-foreground))',
}

const RevenueBarChart = memo(() => {
  // Memoize data transformation to prevent recalculation on every render
  const chartData = useMemo(() => {
    return monthlyRevenue2024.map((monthData: MonthlyRevenueData) => ({
      month: monthData.month, // Use month for X-axis
      revenue: Math.round(monthData.revenue / 1000000), // Convert to millions for readability
    }))
  }, [])
  return (
    <div className="portfolio-card">
      <h2 className="mb-4 text-xl font-semibold">
        Monthly Revenue 2024 (Millions USD) 
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            strokeOpacity={0.3} 
          />
          <XAxis
            dataKey="month" // Changed dataKey to month
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
            formatter={(value) => { // 'value' here is the 'revenue' from the 'data' object (already in millions)
              return [`$${value}M`, 'Revenue'];
            }}
            labelFormatter={(label) => `Month: ${label}`} // 'label' is the 'month'
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              boxShadow: 'var(--shadow-dark-lg)', // Assuming you have this shadow defined or it's from a library
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
        Monthly revenue breakdown for the current year (2024).
      </p>
    </div>
  )
})

RevenueBarChart.displayName = 'RevenueBarChart'

export default RevenueBarChart
