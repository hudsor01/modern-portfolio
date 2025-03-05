'use client'
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts'

const data = [
	{ source: 'Organic', value: 400 },
	{ source: 'Paid Ads', value: 300 },
	{ source: 'Referral', value: 200 },
	{ source: 'Social', value: 100 },
]

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']

export default function LeadSourcePieChart() {
	return (
		<div className='w-full max-w-md rounded-lg bg-gray-800 p-4 shadow-lg'>
			<h2 className='mb-2 text-xl font-semibold'>Lead Sources</h2>
			<ResponsiveContainer width='100%' height={300}>
				<PieChart>
					<Tooltip />
					<Pie
						data={data}
						dataKey='value'
						nameKey='source'
						cx='50%'
						cy='50%'
						outerRadius={80}
						fill='#4F46E5'>
						{data.map((_, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}
