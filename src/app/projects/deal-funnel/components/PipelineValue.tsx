'use client'


import { TrendingUp } from 'lucide-react'

interface PipelineValueProps {
  totalRevenue: number
}

export function PipelineValue({ totalRevenue }: PipelineValueProps) {
  return (
    <div
      className="mt-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xs border border-purple-500/20 rounded-xl p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="typography-h3 mb-2">Total Pipeline Value</h2>
          <p className="typography-h1 text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ${(totalRevenue / 1000000).toFixed(1)}M
          </p>
          <p className="text-muted-foreground mt-2">Based on closed deals × average deal size</p>
        </div>
        <div className="text-right">
          <div className="p-4 bg-purple-500/20 rounded-xl">
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
