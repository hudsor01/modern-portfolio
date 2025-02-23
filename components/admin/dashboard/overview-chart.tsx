"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useState } from "react"

const data = [
  {
    date: "Jan 1",
    visitors: 100,
    pageviews: 200,
  },
  // Add more data points...
]

export function Overview() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d")

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="pageviews" stroke="#465fff" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="visitors" stroke="#1d2939" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

