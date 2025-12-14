'use client'

import { LazyPieChart as PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from '@/components/charts/lazy-charts'
import type { PieLabelRenderProps } from 'recharts'

// Production lead source data with realistic distribution and growth metrics
const leadSourceData = [
  { name: 'Organic Search', value: 3420, growth: '+18.5%', color: 'var(--color-primary)' },
  { name: 'Paid Search', value: 2150, growth: '+12.3%', color: 'var(--color-secondary)' },
  { name: 'Social Media', value: 1680, growth: '+24.7%', color: 'var(--color-secondary)' },
  { name: 'Email Marketing', value: 1290, growth: '+8.9%', color: 'var(--color-chart-5)' },
  { name: 'Direct Traffic', value: 980, growth: '+5.2%', color: 'var(--color-chart-5)' },
  { name: 'Referrals', value: 740, growth: '+31.4%', color: 'var(--color-accent)' },
  { name: 'Content Marketing', value: 580, growth: '+19.8%', color: 'var(--color-accent)' },
  { name: 'Partnerships', value: 420, growth: '+42.1%', color: 'var(--color-accent)' },
]

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      growth: string;
    };
  }>;
}

export default function LeadSourcePieChart() {
  const total = leadSourceData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0 && payload[0]?.payload) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="p-3 rounded-xl bg-[#0f172a]/90 backdrop-blur-xs border border-white/10">
          <p className="font-medium text-white">{data.name}</p>
          <p className="typography-small text-muted-foreground">
            Leads: <span className="font-medium text-white">{data.value.toLocaleString()}</span>
          </p>
          <p className="typography-small text-muted-foreground">
            Share: <span className="font-medium text-white">{percentage}%</span>
          </p>
          <p className="typography-small text-muted-foreground">
            Growth: <span className="font-medium text-success">{data.growth}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = (entry: PieLabelRenderProps) => {
    if (typeof entry.value === 'number') {
      const percentage = ((entry.value / total) * 100).toFixed(0);
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
              fill="#8884d8"
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
            <div key={source.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
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
}
