'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
	{ month: 'Jan', revenue: 12000 },
	{ month: 'Feb', revenue: 15000 },
	{ month: 'Mar', revenue: 18000 },
	{ month: 'Apr', revenue: 20000 },
]

export default function RevenueBarChart() {
	return (
		<div className='rounded-lg bg-gray-800 p-4 shadow-lg'>
			<h2 className='mb-2 text-xl font-semibold'>Monthly Revenue Breakdown</h2>
			<ResponsiveContainer width='100%' height={300}>
				<BarChart data={data}>
					<XAxis dataKey='month' stroke='#ccc' />
					<YAxis stroke='#ccc' />
					<Tooltip />
					<Bar dataKey='revenue' fill='#4F46E5' />
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
