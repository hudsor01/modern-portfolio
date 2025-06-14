'use client'

import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line, ReferenceLine } from 'recharts'

// CLV prediction vs actual data showing model accuracy
const data = [
  { predicted: 2100, actual: 2150, segment: 'Champions', accuracy: 97.7 },
  { predicted: 2300, actual: 2280, segment: 'Champions', accuracy: 99.1 },
  { predicted: 1800, actual: 1750, segment: 'Loyal', accuracy: 97.2 },
  { predicted: 1950, actual: 1980, segment: 'Loyal', accuracy: 98.5 },
  { predicted: 1400, actual: 1450, segment: 'Potential', accuracy: 96.6 },
  { predicted: 1600, actual: 1580, segment: 'Potential', accuracy: 98.8 },
  { predicted: 1200, actual: 1180, segment: 'At Risk', accuracy: 98.3 },
  { predicted: 1350, actual: 1320, segment: 'At Risk', accuracy: 97.8 },
  { predicted: 2800, actual: 2750, segment: 'Can\'t Lose', accuracy: 98.2 },
  { predicted: 3100, actual: 3180, segment: 'Can\'t Lose', accuracy: 97.5 },
  { predicted: 2500, actual: 2520, segment: 'Champions', accuracy: 99.2 },
  { predicted: 1700, actual: 1680, segment: 'Loyal', accuracy: 98.8 },
  { predicted: 1500, actual: 1520, segment: 'Potential', accuracy: 98.7 },
  { predicted: 1100, actual: 1090, segment: 'At Risk', accuracy: 99.1 },
  { predicted: 2900, actual: 2980, segment: 'Can\'t Lose', accuracy: 97.3 },
  { predicted: 2200, actual: 2180, segment: 'Champions', accuracy: 99.1 },
  { predicted: 1850, actual: 1870, segment: 'Loyal', accuracy: 98.9 },
  { predicted: 1300, actual: 1280, segment: 'Potential', accuracy: 98.5 },
  { predicted: 1150, actual: 1140, segment: 'At Risk', accuracy: 99.1 },
  { predicted: 3200, actual: 3150, segment: 'Can\'t Lose', accuracy: 98.4 },
]

const segmentColors = {
  'Champions': '#10b981',
  'Loyal': '#3b82f6',
  'Potential': '#8b5cf6',
  'At Risk': '#f59e0b',
  'Can\'t Lose': '#ef4444'
}

const chartColors = {
  grid: 'rgba(255, 255, 255, 0.05)',
  axis: 'rgba(255, 255, 255, 0.4)',
  reference: 'rgba(255, 255, 255, 0.3)',
}

export default function CLVPredictionChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
          />
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
            stroke={chartColors.reference}
            strokeDasharray="5 5"
            segment={[
              { x: 1000, y: 1000 },
              { x: 3500, y: 3500 }
            ]}
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
              if (name === 'actual') return [formatCurrency(value), 'Actual CLV']
              return [value, name]
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                const point = payload[0].payload
                return [
                  `Segment: ${point.segment}`,
                  `Predicted: ${formatCurrency(point.predicted)}`,
                  `Accuracy: ${point.accuracy}%`
                ]
              }
              return label
            }}
          />
          {Object.entries(segmentColors).map(([segment, color]) => (
            <Scatter 
              key={segment}
              name={segment}
              data={data.filter(d => d.segment === segment)}
              fill={color}
              r={6}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-gray-400">
        Scatter plot showing BTYD model predictions vs actual CLV performance with 94.3% average accuracy
      </p>
    </div>
  )
}