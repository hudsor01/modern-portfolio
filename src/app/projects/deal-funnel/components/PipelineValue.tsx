'use client'


import { TrendingUp } from 'lucide-react'

interface PipelineValueProps {
  totalRevenue: number
}

export function PipelineValue({ totalRevenue }: PipelineValueProps) {
  return (
    <div
      className="mt-8 bg-primary/10 border border-primary/20 rounded-xl p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="typography-h3 mb-2">Total Pipeline Value</h2>
          <p className="typography-h1 text-xl text-primary">
            ${(totalRevenue / 1000000).toFixed(1)}M
          </p>
          <p className="text-muted-foreground mt-2">Based on closed deals × average deal size</p>
        </div>
        <div className="text-right">
          <div className="p-4 bg-primary/20 rounded-xl">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
