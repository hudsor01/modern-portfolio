'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Partner revenue distribution demonstrating 80/20 rule
const data = [
  { name: 'Top 20% Partners', value: 80.2, revenue: 725840, count: 7, color: '#3b82f6' },
  { name: 'Middle 60% Partners', value: 17.1, revenue: 154689, count: 20, color: '#6366f1' },
  { name: 'Bottom 20% Partners', value: 2.7, revenue: 23858, count: 7, color: '#8b5cf6' },
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
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            formatter={(value: number, name: string, props: any) => [
              [
                `${value}% (${formatCurrency(props.payload.revenue)})`,
                `${props.payload.count} partners`
              ],
              name
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-gray-400">
        Channel revenue distribution following Pareto Principle: top 20% of partners generate 80.2% of revenue
      </p>
    </div>
  )
}