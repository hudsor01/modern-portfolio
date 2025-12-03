'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export interface STARMetric {
  phase: string
  impact: number
  efficiency: number
  value: number
}

export interface STARData {
  situation: STARMetric
  task: STARMetric
  action: STARMetric
  result: STARMetric
}

interface STARAreaChartProps {
  data: STARData
  title?: string
  className?: string
}

export function STARAreaChart({ data, title, className = '' }: STARAreaChartProps) {
  // Convert STAR data to chart format
  const chartData = [
    {
      name: 'Situation',
      Impact: data.situation.impact,
      Efficiency: data.situation.efficiency,
      Value: data.situation.value,
    },
    {
      name: 'Task',
      Impact: data.task.impact,
      Efficiency: data.task.efficiency,
      Value: data.task.value,
    },
    {
      name: 'Action',
      Impact: data.action.impact,
      Efficiency: data.action.efficiency,
      Value: data.action.value,
    },
    {
      name: 'Result',
      Impact: data.result.impact,
      Efficiency: data.result.efficiency,
      Value: data.result.value,
    },
  ]

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-white/90">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend
            wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
          />
          <Area
            type="monotone"
            dataKey="Impact"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorImpact)"
          />
          <Area
            type="monotone"
            dataKey="Efficiency"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorEfficiency)"
          />
          <Area
            type="monotone"
            dataKey="Value"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
