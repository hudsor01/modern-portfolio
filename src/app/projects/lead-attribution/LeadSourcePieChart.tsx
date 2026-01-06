'use client'
import { memo } from 'react'

import { LazyPieChart as PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from '@/components/charts/lazy-charts'
import { chartColors } from '@/lib/chart-colors'
import type { PieLabelRenderProps } from 'recharts'

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      growth?: string;
    };
  }>;
}

type LeadSourceDatum = {
  name: string
  value: number
  growth?: string
  color?: string
}

const defaultColors = [
  chartColors.primary,
  chartColors.secondary,
  chartColors.chart3,
  chartColors.chart4,
  chartColors.chart5,
  chartColors.chart1,
]

type LeadSourcePieChartProps = {
  data: LeadSourceDatum[]
}

const LeadSourcePieChart = memo(function LeadSourcePieChart({ data }: LeadSourcePieChartProps) {
  const leadSourceData = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length],
  }))

  const total = leadSourceData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0 && payload[0]?.payload) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="p-3 rounded-xl bg-popover/95 backdrop-blur-xs border border-border">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="typography-small text-muted-foreground">
            Leads: <span className="font-medium text-foreground">{data.value.toLocaleString()}</span>
          </p>
          <p className="typography-small text-muted-foreground">
            Share: <span className="font-medium text-foreground">{percentage}%</span>
          </p>
          {data.growth ? (
            <p className="typography-small text-muted-foreground">
              Performance: <span className="font-medium text-success">{data.growth}</span>
            </p>
          ) : null}
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = (entry: PieLabelRenderProps) => {
    if (typeof entry.value === 'number') {
      const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(0) : '0'
      return `${percentage}%`;
    }
    return '';
  }

  return (
    <div className="w-full">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={leadSourceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={120}
              fill={chartColors.chart3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {leadSourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {leadSourceData.slice(0, 4).map((source) => {
          const percentage = ((source.value / total) * 100).toFixed(1)
          
          return (
            <div key={source.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 ease-out">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: source.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{source.name}</p>
                <p className="typography-small text-muted-foreground">{percentage}% • {source.growth}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

LeadSourcePieChart.displayName = 'LeadSourcePieChart'

export default LeadSourcePieChart
