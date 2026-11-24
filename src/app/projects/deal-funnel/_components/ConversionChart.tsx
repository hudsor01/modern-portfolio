'use client'

import { LazyBarChart as RechartsBarChart } from '@/components/charts/lazy-charts'
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts'
import { chartColors, chartCssVars } from '@/lib/charts'
import { ChartHeader } from '@/components/ui/chart-container'

interface StageConversion {
  stage: string
  conversion: number
  color: string
}

interface ConversionChartProps {
  stageConversions: StageConversion[]
}

interface TickProps {
  x?: number
  y?: number
  payload?: { value: string }
}

/** Two-line tick ("Leads →" over "Qualified") so long stage pairs fit the left gutter unclipped. */
function StageTick({ x = 0, y = 0, payload }: TickProps) {
  const [from = '', to = ''] = (payload?.value ?? '').split(' → ')
  return (
    <text x={x} y={y} textAnchor="end" fill={chartColors.axis} fontSize={12}>
      <tspan x={x} dy="-0.2em">
        {from} →
      </tspan>
      <tspan x={x} dy="1.2em">
        {to}
      </tspan>
    </text>
  )
}

export function ConversionChart({ stageConversions }: ConversionChartProps) {
  return (
    <div className="flex h-full flex-col">
      <ChartHeader
        title="Stage Conversion Rates"
        description="Conversion between each stage of the sales funnel"
        headingLevel={2}
        className="mb-6"
      />
      <div className="h-72 w-full shrink-0" data-testid="conversion-chart">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={stageConversions}
            layout="vertical"
            margin={{ top: 4, right: 24, bottom: 4, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis
              type="number"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
              stroke={chartColors.axis}
              fontSize={12}
            />
            <YAxis
              type="category"
              dataKey="stage"
              width={96}
              tick={<StageTick />}
              stroke={chartColors.axis}
              interval={0}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartCssVars.popover,
                borderRadius: '12px',
                border: `1px solid ${chartCssVars.border}`,
                backdropFilter: 'blur(10px)',
              }}
              formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, 'Conversion Rate']}
            />
            <Bar dataKey="conversion" radius={[0, 8, 8, 0]}>
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
