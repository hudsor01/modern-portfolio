"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { yearOverYearGrowth } from "@/lib/data/partner-analytics";

// Transform the real data for the bar chart
const data = yearOverYearGrowth.map(yearData => ({
  year: yearData.year.toString(),
  revenue: Math.round(yearData.total_revenue / 1000000), // Convert to millions for readability
  transactions: yearData.total_transactions
}));

export default function RevenueBarChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Annual Revenue (Millions USD)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.3} />
          <XAxis 
            dataKey="year" 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#64748b', strokeOpacity: 0.5 }}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#64748b', strokeOpacity: 0.5 }}
            tickFormatter={(value) => `$${value}M`}
          />
          <Tooltip 
            formatter={(value) => [`$${value}M`, 'Revenue']}
            labelFormatter={(year) => `Year: ${year}`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey="revenue" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center italic">
        Revenue growth from 2020-2024 showing steady increase year over year
      </p>
    </div>
  );
}
