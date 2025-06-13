'use client'
import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Area,
  ComposedChart,
} from 'recharts'
import { staticChurnData } from '@/app/projects/data/partner-analytics'

// Transform data for visualization
const data = staticChurnData.map((item) => ({
  month: item.month,
  churn: item.churn_rate,
  retention: 100 - item.churn_rate,
}))

export default function ChurnLineChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-500/20 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="churnGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255, 255, 255, 0.05)" 
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="rgba(255, 255, 255, 0.4)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.4)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            itemStyle={{ color: 'white' }}
            formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name === 'churn' ? 'Churn Rate' : 'Retention Rate']}
          />
          <Legend 
            iconType="line"
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => value === 'churn' ? 'Churn Rate' : 'Retention Rate'}
          />
          <Area
            type="monotone"
            dataKey="churn"
            stroke="transparent"
            fill="url(#churnGradient)"
            fillOpacity={1}
          />
          <Line
            type="monotone"
            dataKey="churn"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#ef4444' }}
            animationDuration={1500}
            name="churn"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}