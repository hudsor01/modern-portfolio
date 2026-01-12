'use client'

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LazyBarChart as RechartsBarChart,
  Bar,
  Cell,
} from '@/components/charts/lazy-charts'
import { chartColors, chartCssVars } from '@/lib/chart-colors'

interface StageConversion {
  stage: string
  conversion: number
  color: string
}

interface ConversionChartProps {
  stageConversions: StageConversion[]
}

export function ConversionChart({ stageConversions }: ConversionChartProps) {
  return (
    <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out">
      <h2 className="typography-h3 mb-6">Stage Conversion Rates</h2>
      <div className="h-[var(--chart-height-sm)]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={stageConversions} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis
              dataKey="stage"
              stroke={chartColors.axis}
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              stroke={chartColors.axis}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartCssVars.popover,
                borderRadius: '12px',
                border: `1px solid ${chartCssVars.border}`,
                backdropFilter: 'blur(10px)',
              }}
              formatter={(value: number | undefined) => [
                `${(value ?? 0).toFixed(1)}%`,
                'Conversion Rate',
              ]}
            />
            <Bar dataKey="conversion" radius={[8, 8, 0, 0]}>
              {stageConversions.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
