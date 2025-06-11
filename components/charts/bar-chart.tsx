'use client'

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ChartData } from '@/types/project' // Assuming ChartData is in types/project.ts

interface BarChartProps {
  data: ChartData[]
  title?: string
  dataKey: string
  xAxisKey?: string
  color?: string
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  valueFormatter?: (value: number) => string
  className?: string
}

export function BarChart({ 
  data, 
  title,
  dataKey,
  xAxisKey = 'name',
  color = 'hsl(var(--chart-1))',
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  valueFormatter = (value) => value.toString(),
  className = ''
}: BarChartProps) {
  const formatTooltip = (value: number, name: string) => [
    valueFormatter(value),
    name
  ]

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            tickFormatter={valueFormatter}
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
          <Bar 
            dataKey={dataKey} 
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
