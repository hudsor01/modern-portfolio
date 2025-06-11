import { PieChart } from '@/components/charts/pie-chart'

// TODO: UPDATE FOR A PRODUCTION IMPLEMENTATION
// Sample partner group data - in a real app, this would come from your data layer
const partnerGroupData = [
  { name: 'Enterprise', value: 45000 },
  { name: 'SMB', value: 32000 },
  { name: 'Technology', value: 28000 },
  { name: 'Healthcare', value: 24000 },
  { name: 'Financial', value: 19000 },
  { name: 'Retail', value: 15000 },
]

// V4 Chart Colors using CSS Custom Properties
const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--accent))',
]

export default function PartnerGroupPieChart() {
  return (
    <div className="portfolio-card">
      <PieChart 
        data={partnerGroupData}
        title="Transaction Volume by Partner Group"
        valueFormatter={(value) => `${value.toLocaleString()} transactions`}
        colors={chartColors}
        className="h-80"
      />
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Distribution of transaction volume across top partner groups
      </p>
    </div>
  )
}
