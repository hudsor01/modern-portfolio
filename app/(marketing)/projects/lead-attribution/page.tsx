import LeadSourcePieChart from './LeadSourcePieChart'

export default function LeadAttributionPage() {
	return (
		<div className='min-h-screen bg-gray-900 p-8 text-white'>
			<h1 className='text-3xl font-bold'>Lead Source Attribution</h1>
			<p className='mb-6 text-gray-400'>Analyze where leads are coming from.</p>

			<div className='flex justify-center'>
				<LeadSourcePieChart />
			</div>
		</div>
	)
}
