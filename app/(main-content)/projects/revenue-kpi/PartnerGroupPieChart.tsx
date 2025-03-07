'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { partnerGroupTransactions } from '@/lib/data/partner-analytics';

// Get top 6 partner groups by transaction volume for the pie chart
const sortedGroups = [...partnerGroupTransactions]
  .sort((a, b) => b.transaction_volume - a.transaction_volume)
  .slice(0, 6);

// Transform data for the chart
const data = sortedGroups.map((group) => ({
  name: group.partner_group,
  value: group.transaction_volume,
}));

// Colors for the pie chart
const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

export default function PartnerGroupPieChart() {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">Volume by Group</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1500}
            animationBegin={300}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value.toLocaleString()} transactions`, 'Volume']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ paddingLeft: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center italic">
        Distribution of transaction volume across top groups
      </p>
    </div>
  );
}
