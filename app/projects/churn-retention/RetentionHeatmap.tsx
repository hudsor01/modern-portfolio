'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { monthlyChurnData } from '@/lib/data/partner-analytics'

// Transform data for visualization
const data = monthlyChurnData.slice(0, 6).map(item => ({
  month: item.month,
  retained: parseFloat(((item.retained_partners / (item.retained_partners + item.churned_partners)) * 100).toFixed(1)),
  churned: parseFloat(((item.churned_partners / (item.retained_partners + item.churned_partners)) * 100).toFixed(1))
}))

export default function RetentionHeatmap() {
	return (
		<div className='rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg'>
			<h2 className='mb-4 text-xl font-semibold text-slate-800 dark:text-white'>Partner Retention & Churn (%)</h2>
			<ResponsiveContainer width='100%' height={300}>
				<BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.3} />
					<XAxis 
            dataKey='month' 
            stroke='#64748b' 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#64748b', strokeOpacity: 0.5 }}
          />
					<YAxis 
            stroke='#64748b'
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#64748b', strokeOpacity: 0.5 }}
            unit="%"
          />
					<Tooltip 
            formatter={(value) => [`${value}%`, '']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
					<Bar 
            dataKey='retained' 
            name="Retained" 
            stackId='a' 
            fill='#10B981' 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
					<Bar 
            dataKey='churned' 
            name="Churned" 
            stackId='a' 
            fill='#EF4444' 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
				</BarChart>
			</ResponsiveContainer>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center italic">
        First half of 2024 showing consistently high partner retention rates
      </p>
		</div>
	)
}
