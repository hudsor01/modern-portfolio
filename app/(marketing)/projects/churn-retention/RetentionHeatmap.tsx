'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
	{ month: 'Jan', retained: 90, churned: 10 },
	{ month: 'Feb', retained: 85, churned: 15 },
	{ month: 'Mar', retained: 88, churned: 12 },
	{ month: 'Apr', retained: 87, churned: 13 },
	{ month: 'May', retained: 89, churned: 11 },
]

export default function RetentionHeatmap() {
	return (
		<div className='rounded-lg bg-gray-800 p-4 shadow-lg'>
			<h2 className='mb-2 text-xl font-semibold'>Retention Trends</h2>
			<ResponsiveContainer width='100%' height={300}>
				<BarChart data={data} stackOffset='expand'>
					<XAxis dataKey='month' stroke='#ccc' />
					<YAxis stroke='#ccc' />
					<Tooltip />
					<Bar dataKey='retained' stackId='a' fill='#10B981' />
					<Bar dataKey='churned' stackId='a' fill='#EF4444' />
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
