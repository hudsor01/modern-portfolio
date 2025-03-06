"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 3000 },
  { month: "Feb", revenue: 4000 },
  { month: "Mar", revenue: 3500 },
  { month: "Apr", revenue: 5000 },
  { month: "May", revenue: 6000 },
];

export default function RevenueBarChart() {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-2">Revenue Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="revenue" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
