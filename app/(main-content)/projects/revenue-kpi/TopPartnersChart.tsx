'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from 'recharts';
import { topPartnersByRevenue } from '@/lib/data/partner-analytics';

// Transform the real data for the bar chart
const data = topPartnersByRevenue.map((partner) => ({
  name: partner.partner_name,
  revenue: partner.total_sum_of_transactions_usd / 1000000, // Convert to millions for readability
}));

export default function TopPartnersChart() {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
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
            stroke="#ccc"
            strokeOpacity={0.3}
          />
          <XAxis
            type="number"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#64748b', strokeOpacity: 0.5 }}
            tickFormatter={(value: number) => `$${value}M`}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#64748b', strokeOpacity: 0.5 }}
            width={140}
          />
          <Tooltip
            formatter={(value: number) => [`$${value}M`, 'Revenue']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar dataKey="revenue" fill="#6366F1" radius={[0, 4, 4, 0]} animationDuration={1500}>
            <LabelList
              dataKey="revenue"
              position="right"
              formatter={(value: number) => `$${value}M`}
              fill="#64748b"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center italic">
        Revenue contribution from top 5 partner organizations
      </p>
    </div>
  );
}
