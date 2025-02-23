"use client"

import Link from "next/link"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface TopPagesProps {
  data: {
    path: string
    views: number
  }[]
}

export function TopPages({ data }: TopPagesProps) {
  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="path" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="space-y-1">
        {data.map((page) => (
          <div key={page.path} className="flex items-center justify-between">
            <Link href={page.path} className="text-sm text-muted-foreground hover:underline">
              {page.path}
            </Link>
            <span className="text-sm font-medium">{page.views}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

