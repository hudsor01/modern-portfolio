import React from 'react'
import { PieChart } from '@/components/charts/pie-chart' // Corrected path
import { partnerGroupsData, type PartnerGroup } from '@/app/projects/data/partner-analytics' // Corrected path // Import new data and type

// Extract colors from the imported data for the PieChart component's 'colors' prop
const chartColors = partnerGroupsData.map((group: PartnerGroup) => group.color);

// The partnerGroupsData itself can be passed directly to the PieChart's 'data' prop
// as it already has 'name' and 'value' fields.

const PartnerGroupPieChart = React.memo(function PartnerGroupPieChart() {
  return (
    <div className="portfolio-card">
      <PieChart 
        data={partnerGroupsData} // Use imported data
        title="Partner Revenue Contribution (%)" // Updated title
        valueFormatterAction={(value: number) => `${value}%`} // Values are percentages
        colors={chartColors} // Use extracted colors
        className="h-80"
      />
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Percentage of total revenue contributed by each partner group.
      </p>
    </div>
  )
})

export default PartnerGroupPieChart
