'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Partner revenue distribution demonstrating 80/20 rule
const data = [
  { name: 'Top 20% Partners', value: 80.2, revenue: 725840, count: 7, color: 'var(--color-primary)' },
  { name: 'Middle 60% Partners', value: 17.1, revenue: 154689, count: 20, color: 'var(--color-secondary)' },
  { name: 'Bottom 20% Partners', value: 2.7, revenue: 23858, count: 7, color: 'var(--color-secondary)' },
]

const COLORS = data.map(item => item.color)

export default function RevenueContributionChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            formatter={(value: number, name: string, props: unknown) => {
              const payload = (props as { payload?: typeof data[0] })?.payload
              if (!payload) return [String(value), name]
              return [
                [
                  `${value}% (${formatCurrency(payload.revenue)})`,
                  `${payload.count} partners`
                ],
                name
              ]
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ color: 'var(--color-muted-foreground)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Channel revenue distribution following Pareto Principle: top 20% of partners generate 80.2% of revenue
      </p>
    </div>
  )
}
