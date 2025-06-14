'use client'

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ChartData } from '@/types/project' // Assuming ChartData is in types/project.ts

interface LineChartProps {
  data: ChartData[]
  title?: string
  dataKey: string
  xAxisKey?: string
  color?: string
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  valueFormatterAction?: (value: number) => string
  className?: string
}

export function LineChart({ 
  data, 
  title,
  dataKey,
  xAxisKey = 'name',
  color = 'hsl(var(--chart-1))',
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  valueFormatterAction = (value) => value.toString(),
  className = ''
}: LineChartProps) {
  const formatTooltip = (value: number, name: string) => [
    valueFormatterAction(value),
    name
  ]

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'var(--border)' }}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'var(--border)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickFormatter={valueFormatterAction}
          />
          {showTooltip && (
            <Tooltip 
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)'
              }}
            />
          )}
          {showLegend && <Legend />}
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
