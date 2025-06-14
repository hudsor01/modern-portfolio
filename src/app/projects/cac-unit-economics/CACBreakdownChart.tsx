'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// Real data based on partner analysis
const data = [
  { channel: 'Certified Partners', cac: 98, ltv: 687, customers: 1089 },
  { channel: 'Legacy Partners', cac: 156, ltv: 578, customers: 743 },
  { channel: 'Direct Sales', cac: 289, ltv: 534, customers: 201 },
  { channel: 'Inactive Partners', cac: 234, ltv: 445, customers: 67 },
]

const chartColors = {
  cac: '#ef4444',
  ltv: '#10b981',
  grid: 'rgba(255, 255, 255, 0.05)',
  axis: 'rgba(255, 255, 255, 0.4)',
}

export default function CACBreakdownChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            vertical={false}
          />
          <XAxis
            dataKey="channel"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            formatter={(value: number, name: string) => [
              `$${value}`, 
              name === 'cac' ? 'Customer Acquisition Cost' : 'Lifetime Value'
            ]}
          />
          <Bar 
            dataKey="cac" 
            fill={chartColors.cac} 
            radius={[4, 4, 0, 0]} 
            name="cac"
          />
          <Bar 
            dataKey="ltv" 
            fill={chartColors.ltv} 
            radius={[4, 4, 0, 0]} 
            name="ltv"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-gray-400">
        Partner channel CAC optimization revealing 70% cost reduction through certified partner strategy vs direct sales acquisition
      </p>
    </div>
  )
}