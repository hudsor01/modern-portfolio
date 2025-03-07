'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { yearOverYearGrowth } from "@/lib/data/partner-analytics";

// Transform the real data for the line chart
const data = yearOverYearGrowth.map(yearData => ({
  year: yearData.year.toString(),
  revenue: yearData.total_revenue / 1000000, // Convert to millions
  transactions: Math.round(yearData.total_transactions / 1000), // Convert to thousands
  commissions: yearData.total_commissions / 1000000 // Convert to millions
}));

export default function RevenueLineChart() {
	return (
		<div className='rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg'>
			<h2 className='mb-4 text-xl font-semibold text-slate-800 dark:text-white'>Revenue Growth Metrics</h2>
			<ResponsiveContainer width='100%' height={300}>
				<LineChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.3} />
					<XAxis 
            dataKey='year' 
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
            tickFormatter={(value) => {
              // Determine if the number is in whole units
              return Number.isInteger(value) ? `${value}` : value.toFixed(1);
            }}
          />
					<Tooltip 
            formatter={(value, name) => {
              if (name === 'revenue') return [`$${value}M`, 'Revenue'];
              if (name === 'transactions') return [`${value}K`, 'Transactions'];
              if (name === 'commissions') return [`$${value}M`, 'Commissions'];
              return [value, name];
            }}
            labelFormatter={(year) => `Year: ${year}`}
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
            dataKey='revenue' 
            stroke='#3B82F6' 
            strokeWidth={2}
            dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 4, fill: 'white' }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#3B82F6' }}
            animationDuration={1500}
          />
          <Line 
            type='monotone' 
            dataKey='transactions' 
            stroke='#10B981' 
            strokeWidth={2}
            dot={{ stroke: '#10B981', strokeWidth: 2, r: 4, fill: 'white' }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#10B981' }}
            animationDuration={1500}
            animationBegin={300}
          />
          <Line 
            type='monotone' 
            dataKey='commissions' 
            stroke='#8B5CF6' 
            strokeWidth={2}
            dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: 'white' }}
            activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#8B5CF6' }}
            animationDuration={1500}
            animationBegin={600}
          />
				</LineChart>
			</ResponsiveContainer>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center italic">
        Year-over-year tracking of key metrics (Revenue in $M, Transactions in K, Commissions in $M)
      </p>
		</div>
	)
}
