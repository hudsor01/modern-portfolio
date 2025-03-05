import DealStageFunnelChart from './DealStageFunnelChart'

export default function DealFunnelPage() {
	return (
		<div className='min-h-screen bg-gray-900 p-8 text-white'>
			<h1 className='text-3xl font-bold'>Deal Stage Conversion Funnel</h1>
			<p className='mb-6 text-gray-400'>Visualize conversion rates across sales stages.</p>

			<div className='flex justify-center'>
				<DealStageFunnelChart />
			</div>
		</div>
	)
}
