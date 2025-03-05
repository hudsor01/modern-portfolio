'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
	{ month: 'Jan', churn: 5 },
	{ month: 'Feb', churn: 7 },
	{ month: 'Mar', churn: 4 },
	{ month: 'Apr', churn: 6 },
	{ month: 'May', churn: 3 },
]

export default function ChurnLineChart() {
	return (
		<div className='rounded-lg bg-gray-800 p-4 shadow-lg'>
			<h2 className='mb-2 text-xl font-semibold'>Churn Rate Over Time</h2>
			<ResponsiveContainer width='100%' height={300}>
				<LineChart data={data}>
					<XAxis dataKey='month' stroke='#ccc' />
					<YAxis stroke='#ccc' />
					<Tooltip />
					<Line type='monotone' dataKey='churn' stroke='#EF4444' strokeWidth={2} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}
