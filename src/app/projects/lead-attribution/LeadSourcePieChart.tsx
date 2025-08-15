'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, PieLabelRenderProps } from 'recharts'

// Production lead source data with realistic distribution and growth metrics
const leadSourceData = [
  { name: 'Organic Search', value: 3420, growth: '+18.5%', color: '#3b82f6' },
  { name: 'Paid Search', value: 2150, growth: '+12.3%', color: '#6366f1' },
  { name: 'Social Media', value: 1680, growth: '+24.7%', color: '#8b5cf6' },
  { name: 'Email Marketing', value: 1290, growth: '+8.9%', color: '#a855f7' },
  { name: 'Direct Traffic', value: 980, growth: '+5.2%', color: '#c084fc' },
  { name: 'Referrals', value: 740, growth: '+31.4%', color: '#e879f9' },
  { name: 'Content Marketing', value: 580, growth: '+19.8%', color: '#ec4899' },
  { name: 'Partnerships', value: 420, growth: '+42.1%', color: '#f472b6' },
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
        <div className="p-3 rounded-xl bg-[#0f172a]/90 backdrop-blur-sm border border-white/10">
          <p className="font-medium text-white">{data.name}</p>
          <p className="text-sm text-gray-300">
            Leads: <span className="font-medium text-white">{data.value.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-300">
            Share: <span className="font-medium text-white">{percentage}%</span>
          </p>
          <p className="text-sm text-gray-300">
            Growth: <span className="font-medium text-green-400">{data.growth}</span>
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
                <p className="text-sm font-medium text-white truncate">{source.name}</p>
                <p className="text-xs text-gray-400">{percentage}% • {source.growth}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
