'use client'
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts'
import { leadSources } from '@/lib/data/partner-analytics'

// Transform data for visualization
const data = leadSources.map(source => ({
  name: source.source,
  value: source.count,
  percentage: source.percentage,
  avgDealValue: source.avg_deal_value
}))

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function LeadSourcePieChart() {
	return (
		<div className='w-full max-w-3xl rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg mx-auto'>
			<h2 className='mb-4 text-xl font-semibold text-slate-800 dark:text-white'>Partner Lead Sources</h2>
			<div className="flex flex-col lg:flex-row items-center">
        <ResponsiveContainer width='100%' height={400}>
          <PieChart>
            <Tooltip 
              formatter={(value, name, props) => {
                return [
                  `${value.toLocaleString()} (${props.payload.percentage}%)`, 
                  name
                ]
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              formatter={(value, entry) => {
                const { payload } = entry;
                return (
                  <span className="text-sm">
                    {value}: {payload.percentage}%
                  </span>
                );
              }}
            />
            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={130}
              innerRadius={60}
              paddingAngle={2}
              isAnimationActive={true}
              animationDuration={1500}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                index,
              }) => {
                if (percent < 0.05) return null;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight="bold"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  strokeWidth={1}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.map((source, index) => (
          <div 
            key={index} 
            className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {source.name}
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {source.value.toLocaleString()} leads ({source.percentage}%)
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Avg deal: ${source.avgDealValue.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
		</div>
	)
}
