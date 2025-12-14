'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { LazyBarChart as BarChart, Bar, XAxis, YAxis, CartesianGrid } from '@/components/charts/lazy-charts'
import { partnerGroupsData, type PartnerGroup } from '@/app/projects/data/partner-analytics'

const chartData = partnerGroupsData.map((group: PartnerGroup) => ({
  name: group.name,
  value: group.value,
}))

const chartConfig = {
  value: {
    label: 'Contribution',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function PartnerGroupPieChart() {
  return (
    <Card className="portfolio-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Partner Revenue Contribution (%)</CardTitle>
        <CardDescription>
          Percentage of total revenue contributed by each partner group
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
