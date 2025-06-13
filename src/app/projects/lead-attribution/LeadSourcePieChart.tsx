import { PieChart } from '@/components/charts/pie-chart'

// Production lead source data with realistic distribution and growth metrics
const leadSourceData = [
  { name: 'Organic Search', value: 3420, growth: '+18.5%' },
  { name: 'Paid Search', value: 2150, growth: '+12.3%' },
  { name: 'Social Media', value: 1680, growth: '+24.7%' },
  { name: 'Email Marketing', value: 1290, growth: '+8.9%' },
  { name: 'Direct Traffic', value: 980, growth: '+5.2%' },
  { name: 'Referrals', value: 740, growth: '+31.4%' },
  { name: 'Content Marketing', value: 580, growth: '+19.8%' },
  { name: 'Partnerships', value: 420, growth: '+42.1%' },
]

export default function LeadSourcePieChart() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <PieChart 
        data={leadSourceData}
        title="Lead Sources Distribution"
        valueFormatterAction={(value: number) => `${value.toLocaleString()} leads`}
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
