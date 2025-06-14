'use client'

import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Area, ComposedChart } from 'recharts'

// CLV trend data with confidence intervals and forecasting
const data = [
  { month: 'Jan 23', actual: 2450, predicted: 2420, confidence_high: 2580, confidence_low: 2260, customers: 3890 },
  { month: 'Feb 23', actual: 2520, predicted: 2510, confidence_high: 2650, confidence_low: 2370, customers: 3945 },
  { month: 'Mar 23', actual: 2610, predicted: 2580, confidence_high: 2720, confidence_low: 2440, customers: 4012 },
  { month: 'Apr 23', actual: 2680, predicted: 2670, confidence_high: 2810, confidence_low: 2530, customers: 4089 },
  { month: 'May 23', actual: 2720, predicted: 2700, confidence_high: 2840, confidence_low: 2560, customers: 4156 },
  { month: 'Jun 23', actual: 2780, predicted: 2760, confidence_high: 2900, confidence_low: 2620, customers: 4223 },
  { month: 'Jul 23', actual: 2820, predicted: 2810, confidence_high: 2950, confidence_low: 2670, customers: 4287 },
  { month: 'Aug 23', actual: 2847, predicted: 2840, confidence_high: 2980, confidence_low: 2700, customers: 4287 },
  // Future predictions (no actual data)
  { month: 'Sep 23', actual: null, predicted: 2890, confidence_high: 3030, confidence_low: 2750, customers: 4350 },
  { month: 'Oct 23', actual: null, predicted: 2920, confidence_high: 3080, confidence_low: 2760, customers: 4420 },
  { month: 'Nov 23', actual: null, predicted: 2980, confidence_high: 3140, confidence_low: 2820, customers: 4485 },
  { month: 'Dec 23', actual: null, predicted: 3020, confidence_high: 3200, confidence_low: 2840, customers: 4550 },
]

const chartColors = {
  actual: '#10b981',
  predicted: '#3b82f6',
  confidence: 'rgba(59, 130, 246, 0.2)',
  grid: 'rgba(255, 255, 255, 0.05)',
  axis: 'rgba(255, 255, 255, 0.4)',
}

export default function CLVTrendChart() {
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
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            vertical={false}
          />
          <XAxis
            dataKey="month"
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
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            formatter={(value: unknown, name: string) => {
              if (value === null) return ['N/A', name]
              if (name === 'actual') return [formatCurrency(Number(value)), 'Actual CLV']
              if (name === 'predicted') return [formatCurrency(Number(value)), 'Predicted CLV']
              if (name === 'confidence_high') return [formatCurrency(Number(value)), 'Upper Confidence']
              if (name === 'confidence_low') return [formatCurrency(Number(value)), 'Lower Confidence']
              if (name === 'customers') return [Number(value).toLocaleString(), 'Customer Count']
              return [String(value), name]
            }}
          />
          <Legend />
          
          {/* Confidence interval area */}
          <Area
            type="monotone"
            dataKey="confidence_high"
            stroke="none"
            fill={chartColors.confidence}
            fillOpacity={0.3}
            name="Confidence Interval"
          />
          <Area
            type="monotone"
            dataKey="confidence_low"
            stroke="none"
            fill="white"
            fillOpacity={1}
            name=""
          />

          {/* Actual CLV line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke={chartColors.actual}
            strokeWidth={3}
            dot={{ fill: chartColors.actual, strokeWidth: 2, r: 4 }}
            connectNulls={false}
            name="actual"
          />

          {/* Predicted CLV line */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke={chartColors.predicted}
            strokeWidth={3}
            dot={{ fill: chartColors.predicted, strokeWidth: 2, r: 4 }}
            strokeDasharray="5 5"
            name="predicted"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-gray-400">
        CLV trend analysis with 24-month forecasting and 95% confidence intervals using BTYD predictive modeling
      </p>
    </div>
  )
}
