'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { monthlyChurnData } from '@/lib/data/partner-analytics'

// Transform data for visualization
const data = monthlyChurnData.map(item => ({
  month: item.month,
  churn: item.churn_rate
}));

export default function ChurnLineChart() {
	return (
		<div className='rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg'>
			<h2 className='mb-4 text-xl font-semibold text-slate-800 dark:text-white'>Monthly Churn Rate (%)</h2>
			<ResponsiveContainer width='100%' height={300}>
				<LineChart 
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
            domain={[0, 'dataMax + 1']}
            tickFormatter={(value) => `${value}%`}
          />
					<Tooltip 
            formatter={(value) => [`${value}%`, 'Churn Rate']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
					<Line 
            type='monotone' 
            dataKey='churn' 
            stroke='#EF4444' 
            strokeWidth={2}
            dot={{ stroke: '#EF4444', strokeWidth: 2, r: 4, fill: 'white' }}
            activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2, fill: '#EF4444' }}
            animationDuration={1500}
          />
				</LineChart>
			</ResponsiveContainer>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center italic">
        Monthly partner churn rate showing stable retention with seasonal fluctuations
      </p>
		</div>
	)
}
