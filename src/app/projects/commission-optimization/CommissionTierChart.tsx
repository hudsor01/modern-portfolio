'use client'

import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

// Commission tier performance data
const data = [
  {
    tier: 'Elite',
    partners: 8,
    commissionRate: 28.0,
    totalEarnings: 89600,
    avgEarnings: 11200,
    roi: 4.2,
    performanceBonus: 15.0,
    retentionRate: 95.0,
    satisfactionScore: 96.5
  },
  {
    tier: 'Premium',
    partners: 12,
    commissionRate: 25.0,
    totalEarnings: 67800,
    avgEarnings: 5650,
    roi: 3.8,
    performanceBonus: 10.0,
    retentionRate: 92.0,
    satisfactionScore: 94.2
  },
  {
    tier: 'Standard',
    partners: 19,
    commissionRate: 20.0,
    totalEarnings: 45600,
    avgEarnings: 2400,
    roi: 3.2,
    performanceBonus: 5.0,
    retentionRate: 87.0,
    satisfactionScore: 89.1
  },
  {
    tier: 'Growth',
    partners: 8,
    commissionRate: 15.0,
    totalEarnings: 15450,
    avgEarnings: 1931,
    roi: 2.1,
    performanceBonus: 0,
    retentionRate: 78.0,
    satisfactionScore: 82.4
  },
]

const chartColors = {
  earnings: '#10b981',
  roi: '#3b82f6',
  commissionRate: '#f59e0b',
  retention: '#8b5cf6',
  satisfaction: '#ef4444',
  grid: 'rgba(255, 255, 255, 0.05)',
  axis: 'rgba(255, 255, 255, 0.4)',
}

export default function CommissionTierChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            vertical={false}
          />
          <XAxis
            dataKey="tier"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
          />
          <YAxis
            yAxisId="earnings"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis
            yAxisId="percentage"
            orientation="right"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'totalEarnings') return [formatCurrency(value), 'Total Earnings']
              if (name === 'avgEarnings') return [formatCurrency(value), 'Avg Earnings']
              if (name === 'commissionRate') return [`${value}%`, 'Commission Rate']
              if (name === 'roi') return [`${value}x`, 'ROI']
              if (name === 'retentionRate') return [`${value}%`, 'Retention Rate']
              if (name === 'satisfactionScore') return [`${value}%`, 'Satisfaction Score']
              if (name === 'performanceBonus') return [`${value}%`, 'Performance Bonus']
              if (name === 'partners') return [value, 'Partner Count']
              return [value, name]
            }}
            labelFormatter={(label) => `${label} Tier Performance`}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px'
            }}
          />
          <Bar 
            yAxisId="earnings"
            dataKey="totalEarnings" 
            fill={chartColors.earnings} 
            radius={[4, 4, 0, 0]} 
            name="totalEarnings"
          />
          <Line 
            yAxisId="percentage"
            type="monotone" 
            dataKey="retentionRate" 
            stroke={chartColors.retention} 
            strokeWidth={3}
            dot={{ fill: chartColors.retention, strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: chartColors.retention, strokeWidth: 2 }}
            name="retentionRate"
          />
          <Line 
            yAxisId="percentage"
            type="monotone" 
            dataKey="satisfactionScore" 
            stroke={chartColors.satisfaction} 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: chartColors.satisfaction, strokeWidth: 2, r: 4 }}
            name="satisfactionScore"
          />
          <Line 
            yAxisId="percentage"
            type="monotone" 
            dataKey="commissionRate" 
            stroke={chartColors.commissionRate} 
            strokeWidth={2}
            strokeDasharray="8 3"
            dot={{ fill: chartColors.commissionRate, strokeWidth: 2, r: 4 }}
            name="commissionRate"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-gray-400">
        Commission tier analysis showing earnings distribution, partner retention rates, satisfaction scores, and commission rate optimization across performance tiers
      </p>
    </div>
  )
}