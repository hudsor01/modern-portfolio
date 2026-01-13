'use client'
import { memo } from 'react'

import {
  LazyScatterChart as ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from '@/components/charts/lazy-charts'
import { chartColors, segmentColors, chartCssVars } from '@/lib/chart-colors'
import { clvPredictionData } from '../data/constants'

const scatterSegmentColors = {
  Champions: segmentColors.Champions,
  Loyal: segmentColors.Loyal,
  Potential: segmentColors.Potential,
  'At Risk': segmentColors['At Risk'],
  "Can't Lose": segmentColors["Can't Lose"],
}

const CLVPredictionChart = memo(function CLVPredictionChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="h-[var(--chart-height-md)]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={clvPredictionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis
            type="number"
            dataKey="predicted"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => formatCurrency(value)}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <YAxis
            type="number"
            dataKey="actual"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => formatCurrency(value)}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          {/* Perfect prediction reference line */}
          <ReferenceLine
            stroke={chartColors.muted}
            strokeDasharray="5 5"
            segment={[
              { x: 1000, y: 1000 },
              { x: 3500, y: 3500 },
            ]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartCssVars.popover,
              borderRadius: '12px',
              border: `1px solid ${chartCssVars.border}`,
              backdropFilter: 'blur(10px)',
              color: chartCssVars.cardForeground,
            }}
            formatter={(value: number | undefined, name: string | undefined) => {
              const safeValue = value ?? 0
              const safeName = name ?? ''
              if (safeName === 'actual') return [formatCurrency(safeValue), 'Actual CLV']
              return [safeValue, safeName]
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                const point = payload[0].payload
                return [
                  `Segment: ${point.segment}`,
                  `Predicted: ${formatCurrency(point.predicted)}`,
                  `Accuracy: ${point.accuracy}%`,
                ]
              }
              return label
            }}
          />
          {Object.entries(scatterSegmentColors).map(([segment, color]) => (
            <Scatter
              key={segment}
              name={segment}
              data={clvPredictionData.filter((d) => d.segment === segment)}
              fill={color}
              r={6}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Scatter plot showing BTYD model predictions vs actual CLV performance with 94.3% average
        accuracy
      </p>
    </div>
  )
})

CLVPredictionChart.displayName = 'CLVPredictionChart'

export default CLVPredictionChart
