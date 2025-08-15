'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from 'recharts'
import { topPartnersData, type TopPartnerData } from '@/app/projects/data/partner-analytics' // Corrected path

// Transform the real data for the bar chart
const data = topPartnersData.map((partner: TopPartnerData) => ({ // Added type for partner
  name: partner.name,
  revenue: partner.revenue / 1000000,
}));

// V4 Chart Colors using CSS Custom Properties
const chartColors = {
  primary: 'hsl(var(--chart-1))',
  grid: 'hsl(var(--border))',
  axis: 'hsl(var(--muted-foreground))',
  label: 'hsl(var(--muted-foreground))',
}

export default function TopPartnersChart() {
  return (
    <div className="portfolio-card">
      <h2 className="mb-4 text-xl font-semibold">
        Top 5 Partners by Revenue ($M)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke={chartColors.grid}
            strokeOpacity={0.3}
          />
          <XAxis
            type="number"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value: number) => `$${value}M`}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            width={140}
          />
          <Tooltip
            formatter={(value: number) => [`$${value}M`, 'Revenue']}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              boxShadow: 'var(--shadow-dark-lg)',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Bar dataKey="revenue" fill={chartColors.primary} radius={[0, 4, 4, 0]} animationDuration={1500}>
            <LabelList
              dataKey="revenue"
              position="right"
              formatter={(value: unknown) => {
                if (typeof value === 'number') {
                  return `$${value}M`;
                }
                return String(value);
              }}
              fill={chartColors.label}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Revenue contribution from top 5 partner organizations
      </p>
    </div>
  )
}
