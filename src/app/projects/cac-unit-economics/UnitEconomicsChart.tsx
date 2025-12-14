'use client'

import { LazyLineChart as LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from '@/components/charts/lazy-charts'

// Unit economics progression over time
const data = [
  { month: 'Jan', ltv: 534, cac: 189, ratio: 2.8, payback: 11.2 },
  { month: 'Feb', ltv: 548, cac: 178, ratio: 3.1, payback: 10.8 },
  { month: 'Mar', ltv: 567, cac: 172, ratio: 3.3, payback: 10.1 },
  { month: 'Apr', ltv: 582, cac: 168, ratio: 3.5, payback: 9.4 },
  { month: 'May', ltv: 595, cac: 165, ratio: 3.6, payback: 8.9 },
  { month: 'Jun', ltv: 612, cac: 161, ratio: 3.8, payback: 8.4 },
  { month: 'Jul', ltv: 618, cac: 158, ratio: 3.9, payback: 8.1 },
  { month: 'Aug', ltv: 625, cac: 156, ratio: 4.0, payback: 7.8 },
]

const chartColors = {
  ltv: 'var(--color-success)',
  cac: 'var(--color-destructive)', 
  ratio: 'var(--color-primary)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

export default function UnitEconomicsChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
          />
          <YAxis
            yAxisId="currency"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            yAxisId="ratio"
            orientation="right"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}:1`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'ratio') return [`${value.toFixed(1)}:1`, 'LTV:CAC Ratio']
              if (name === 'payback') return [`${value.toFixed(1)} mo`, 'Payback Period']
              return [`$${value}`, name.toUpperCase()]
            }}
          />
          <Legend />
          <Line
            yAxisId="currency"
            type="monotone"
            dataKey="ltv"
            stroke={chartColors.ltv}
            strokeWidth={3}
            dot={{ fill: chartColors.ltv, strokeWidth: 2, r: 4 }}
            name="LTV"
          />
          <Line
            yAxisId="currency"
            type="monotone"
            dataKey="cac"
            stroke={chartColors.cac}
            strokeWidth={3}
            dot={{ fill: chartColors.cac, strokeWidth: 2, r: 4 }}
            name="CAC"
          />
          <Line
            yAxisId="ratio"
            type="monotone"
            dataKey="ratio"
            stroke={chartColors.ratio}
            strokeWidth={3}
            dot={{ fill: chartColors.ratio, strokeWidth: 2, r: 4 }}
            name="LTV:CAC Ratio"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        LTV:CAC ratio optimization achieving industry-benchmark 3.6:1+ efficiency through strategic partner channel management
      </p>
    </div>
  )
}