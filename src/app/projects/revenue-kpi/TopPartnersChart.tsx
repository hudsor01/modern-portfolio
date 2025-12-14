'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { LazyBarChart as BarChart, Bar, XAxis, YAxis, CartesianGrid } from '@/components/charts/lazy-charts'
import { topPartnersData, type TopPartnerData } from '@/app/projects/data/partner-analytics'

const chartData = topPartnersData.map((partner: TopPartnerData) => ({
  name: partner.name,
  revenue: partner.revenue / 1000000,
}))

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function TopPartnersChart() {
  return (
    <Card className="portfolio-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Top 5 Partners by Revenue ($M)</CardTitle>
        <CardDescription>
          Revenue contribution from top 5 partner organizations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
              tickFormatter={(value) => `$${value}M`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
