'use client'


import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  LazyComposedChart as ComposedChart,
} from '@/components/charts/lazy-charts'
import { chartColors, chartCssVars } from '@/lib/charts'

type TrendDatum = {
  month: string
  leads: number
  conversions: number
}

type TrendsChartProps = {
  data: TrendDatum[]
}

export function TrendsChart({ data }: TrendsChartProps) {
  return (
    <div
      className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out"
    >
      <div className="mb-6">
        <h2 className="typography-h3 mb-2">Lead Generation Trends</h2>
        <p className="typography-muted">Monthly lead volume and conversion tracking</p>
      </div>
      <div className="h-[var(--chart-height-lg)]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColors.success} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="month" stroke={chartColors.axis} fontSize={12} />
            <YAxis stroke={chartColors.axis} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartCssVars.popover,
                borderRadius: '12px',
                border: `1px solid ${chartCssVars.border}`,
                backdropFilter: 'blur(10px)',
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="leads" stroke="transparent" fill="url(#leadGradient)" />
            <Line type="monotone" dataKey="leads" stroke={chartColors.primary} strokeWidth={3} dot={{ fill: chartColors.primary, r: 4 }} />
            <Area type="monotone" dataKey="conversions" stroke="transparent" fill="url(#conversionGradient)" />
            <Line type="monotone" dataKey="conversions" stroke={chartColors.success} strokeWidth={3} dot={{ fill: chartColors.success, r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
