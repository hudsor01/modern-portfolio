import { PieChart } from '@/components/charts/pie-chart'

// TODO: UPDATE FOR A PRODUCTION IMPLEMENTATION
// Sample lead source data - in a real app, this would come from your data layer
const leadSourceData = [
  { name: 'Organic Search', value: 1250 },
  { name: 'Paid Search', value: 850 },
  { name: 'Social Media', value: 620 },
  { name: 'Email Marketing', value: 480 },
  { name: 'Direct Traffic', value: 320 },
  { name: 'Referrals', value: 180 },
]

export default function LeadSourcePieChart() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <PieChart 
        data={leadSourceData}
        title="Lead Sources Distribution"
        valueFormatter={(value) => `${value.toLocaleString()} leads`}
        className="h-96"
      />
      
      {/* Additional stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {leadSourceData.map((source) => {
          const total = leadSourceData.reduce((sum, item) => sum + item.value, 0)
          const percentage = ((source.value / total) * 100).toFixed(1)
          
          return (
            <div key={source.name} className="p-4 border border-border rounded-lg">
              <h4 className="font-medium text-sm">{source.name}</h4>
              <p className="text-2xl font-bold">{source.value.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{percentage}% of total</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
