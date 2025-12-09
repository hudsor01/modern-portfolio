'use client'

import { m as motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

interface PipelineValueProps {
  totalRevenue: number
}

export function PipelineValue({ totalRevenue }: PipelineValueProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="mt-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Total Pipeline Value</h2>
          <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ${(totalRevenue / 1000000).toFixed(1)}M
          </p>
          <p className="text-muted-foreground mt-2">Based on closed deals × average deal size</p>
        </div>
        <div className="text-right">
          <div className="p-4 bg-purple-500/20 rounded-2xl">
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
