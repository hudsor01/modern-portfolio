'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

// Partner ROI trends over time showing optimization results
const data = [
  { month: 'Jan', certified: 6.8, legacy: 2.9, newPartners: 1.8, quickRatio: 3.2 },
  { month: 'Feb', certified: 7.1, legacy: 3.0, newPartners: 2.0, quickRatio: 3.6 },
  { month: 'Mar', certified: 7.4, legacy: 3.1, newPartners: 2.1, quickRatio: 3.9 },
  { month: 'Apr', certified: 7.7, legacy: 3.1, newPartners: 2.2, quickRatio: 4.1 },
  { month: 'May', certified: 7.9, legacy: 3.1, newPartners: 2.3, quickRatio: 4.3 },
  { month: 'Jun', certified: 8.2, legacy: 3.1, newPartners: 2.4, quickRatio: 4.7 },
]

const chartColors = {
  certified: '#10b981',
  legacy: '#3b82f6',
  newPartners: '#8b5cf6',
  quickRatio: '#f59e0b',
  grid: 'rgba(255, 255, 255, 0.05)',
  axis: 'rgba(255, 255, 255, 0.4)',
}

export default function PartnerROIChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
          />
          <YAxis
            yAxisId="roi"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}x`}
          />
          <YAxis
            yAxisId="ratio"
            orientation="right"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}x`}
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
              const labels: Record<string, string> = {
                certified: 'Certified Partners ROI',
                legacy: 'Legacy Partners ROI',
                newPartners: 'New Partners ROI',
                quickRatio: 'SaaS Quick Ratio'
              }
              return [`${value}x`, labels[name] || name]
            }}
          />
          <Legend />
          <Line
            yAxisId="roi"
            type="monotone"
            dataKey="certified"
            stroke={chartColors.certified}
            strokeWidth={3}
            dot={{ fill: chartColors.certified, strokeWidth: 2, r: 4 }}
            name="certified"
          />
          <Line
            yAxisId="roi"
            type="monotone"
            dataKey="legacy"
            stroke={chartColors.legacy}
            strokeWidth={3}
            dot={{ fill: chartColors.legacy, strokeWidth: 2, r: 4 }}
            name="legacy"
          />
          <Line
            yAxisId="roi"
            type="monotone"
            dataKey="newPartners"
            stroke={chartColors.newPartners}
            strokeWidth={3}
            dot={{ fill: chartColors.newPartners, strokeWidth: 2, r: 4 }}
            name="newPartners"
          />
          <Line
            yAxisId="ratio"
            type="monotone"
            dataKey="quickRatio"
            stroke={chartColors.quickRatio}
            strokeWidth={3}
            dot={{ fill: chartColors.quickRatio, strokeWidth: 2, r: 4 }}
            strokeDasharray="5 5"
            name="quickRatio"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-gray-400">
        Partner ROI optimization achieving 4.7x SaaS Quick Ratio benchmark through strategic tier management
      </p>
    </div>
  )
}