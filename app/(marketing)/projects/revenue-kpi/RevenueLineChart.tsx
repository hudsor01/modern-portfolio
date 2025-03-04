'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
	{ month: 'Jan', revenue: 12000 },
	{ month: 'Feb', revenue: 15000 },
	{ month: 'Mar', revenue: 18000 },
	{ month: 'Apr', revenue: 20000 },
]

export default function RevenueLineChart() {
	return (
		<div className='rounded-lg bg-gray-800 p-4 shadow-lg'>
			<h2 className='mb-2 text-xl font-semibold'>Revenue Growth Over Time</h2>
			<ResponsiveContainer width='100%' height={300}>
				<LineChart data={data}>
					<XAxis dataKey='month' stroke='#ccc' />
					<YAxis stroke='#ccc' />
					<Tooltip />
					<Line type='monotone' dataKey='revenue' stroke='#4F46E5' strokeWidth={2} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}
