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
  ComposedChart,
} from 'recharts'
import { monthlyTrendData } from '../data/constants'

export function TrendsChart() {
  return (
    <div
      className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300"
    >
      <div className="mb-6">
        <h2 className="typography-h3 mb-2">Lead Generation Trends</h2>
        <p className="typography-muted">Monthly lead volume and conversion tracking</p>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                backdropFilter: 'blur(10px)',
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="leads" stroke="transparent" fill="url(#leadGradient)" />
            <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} dot={{ fill: 'var(--color-primary)', r: 4 }} />
            <Area type="monotone" dataKey="conversions" stroke="transparent" fill="url(#conversionGradient)" />
            <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={3} dot={{ fill: 'var(--color-success)', r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
