'use client'

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { ChartData } from '@/types/project' // Assuming ChartData is in types/project.ts

interface PieChartProps {
  data: ChartData[]
  title?: string
  colors?: string[]
  showLegend?: boolean
  showTooltip?: boolean
  valueFormatterAction?: (value: number) => string
  className?: string
}

const DEFAULT_COLORS = [
  'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--chart-1))',
  'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'
]

export function PieChart({ 
  data, 
  title,
  colors = DEFAULT_COLORS,
  showLegend = true,
  showTooltip = true,
  valueFormatterAction = (value) => value.toString(),
  className = ''
}: PieChartProps) {
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
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="hsl(var(--chart-1))"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Pie>
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
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px'
              }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
