'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'

// Operational efficiency metrics across different areas
const data = [
  {
    category: 'Sales Efficiency',
    current: 89.7,
    target: 85.0,
    industry: 78.3,
  },
  {
    category: 'Lead Quality',
    current: 94.3,
    target: 90.0,
    industry: 82.1,
  },
  {
    category: 'Process Automation',
    current: 78.4,
    target: 80.0,
    industry: 68.9,
  },
  {
    category: 'Data Accuracy',
    current: 96.8,
    target: 95.0,
    industry: 85.7,
  },
  {
    category: 'Forecast Reliability',
    current: 92.4,
    target: 88.0,
    industry: 74.6,
  },
  {
    category: 'Partner Enablement',
    current: 87.9,
    target: 85.0,
    industry: 71.2,
  },
  {
    category: 'Customer Success',
    current: 91.6,
    target: 88.0,
    industry: 79.8,
  },
  {
    category: 'Revenue Recognition',
    current: 98.2,
    target: 95.0,
    industry: 88.4,
  },
]

const chartColors = {
  current: '#10b981',
  target: '#3b82f6',
  industry: '#8b5cf6',
  grid: 'rgba(255, 255, 255, 0.1)',
  axis: 'rgba(255, 255, 255, 0.4)',
}

export default function OperationalMetricsChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <PolarGrid 
            stroke={chartColors.grid}
          />
          <PolarAngleAxis 
            dataKey="category"
            tick={{ fontSize: 12, fill: chartColors.axis }}
            className="text-xs"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[60, 100]}
            tick={{ fontSize: 10, fill: chartColors.axis }}
            tickFormatter={(value) => `${value}%`}
          />
          <Radar
            name="Current Performance"
            dataKey="current"
            stroke={chartColors.current}
            fill={chartColors.current}
            fillOpacity={0.3}
            strokeWidth={3}
          />
          <Radar
            name="Target"
            dataKey="target"
            stroke={chartColors.target}
            fill={chartColors.target}
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Radar
            name="Industry Avg"
            dataKey="industry"
            stroke={chartColors.industry}
            fill={chartColors.industry}
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="3 3"
          />
          <Legend 
            wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-gray-400">
        Operational efficiency radar showing 89.7% average performance vs 85% target and 78% industry benchmark
      </p>
    </div>
  )
}