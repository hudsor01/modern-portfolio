'use client'
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer } from 'recharts'

const data = [
	{ stage: 'Leads', count: 1000 },
	{ stage: 'Qualified', count: 600 },
	{ stage: 'Proposal', count: 300 },
	{ stage: 'Closed Won', count: 150 },
]

export default function DealStageFunnelChart() {
	return (
		<div className='w-full max-w-md rounded-lg bg-gray-800 p-4 shadow-lg'>
			<h2 className='mb-2 text-xl font-semibold'>Deal Funnel</h2>
			<ResponsiveContainer width='100%' height={300}>
				<FunnelChart>
					<Tooltip />
					<Funnel data={data} dataKey='count' nameKey='stage' fill='#4F46E5'>
						<LabelList position='right' fill='#fff' stroke='none' dataKey='stage' />
					</Funnel>
				</FunnelChart>
			</ResponsiveContainer>
		</div>
	)
}
