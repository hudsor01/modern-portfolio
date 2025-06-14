'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// Customer journey funnel data
const data = [
  { stage: 'Awareness', touchpoints: 45670, conversionRate: 18.5, channels: 8, cumulativeConversions: 8449 },
  { stage: 'Interest', touchpoints: 8447, conversionRate: 34.2, channels: 6, cumulativeConversions: 2889 },
  { stage: 'Consideration', touchpoints: 2889, conversionRate: 52.7, channels: 5, cumulativeConversions: 1523 },
  { stage: 'Intent', touchpoints: 1523, conversionRate: 68.9, channels: 4, cumulativeConversions: 1049 },
  { stage: 'Purchase', touchpoints: 1049, conversionRate: 78.6, channels: 3, cumulativeConversions: 825 },
  { stage: 'Retention', touchpoints: 825, conversionRate: 89.3, channels: 4, cumulativeConversions: 737 },
]

const chartColors = {
  touchpoints: '#3b82f6',
  conversions: '#10b981',
  conversionRate: '#f59e0b',
  grid: 'rgba(255, 255, 255, 0.05)',
  axis: 'rgba(255, 255, 255, 0.4)',
}

export default function CustomerJourneyChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            vertical={false}
          />
          <XAxis
            dataKey="stage"
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
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
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
              if (name === 'touchpoints') return [value.toLocaleString(), 'Touchpoints']
              if (name === 'cumulativeConversions') return [value.toLocaleString(), 'Conversions']
              if (name === 'conversionRate') return [`${value}%`, 'Conversion Rate']
              if (name === 'channels') return [value, 'Active Channels']
              return [value, name]
            }}
            labelFormatter={(label) => `Stage: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="touchpoints"
            stackId="1"
            stroke={chartColors.touchpoints}
            fill={chartColors.touchpoints}
            fillOpacity={0.6}
            name="touchpoints"
          />
          <Area
            type="monotone"
            dataKey="cumulativeConversions"
            stackId="2"
            stroke={chartColors.conversions}
            fill={chartColors.conversions}
            fillOpacity={0.8}
            name="cumulativeConversions"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-gray-400">
        Customer journey funnel analysis showing touchpoint density and conversion optimization across 6 key stages
      </p>
    </div>
  )
}