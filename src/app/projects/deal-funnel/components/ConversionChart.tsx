'use client'

import { m as motion } from 'framer-motion'
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart as RechartsBarChart, Bar, Cell } from 'recharts'

interface StageConversion {
  stage: string
  conversion: number
  color: string
}

interface ConversionChartProps {
  stageConversions: StageConversion[]
}

export function ConversionChart({ stageConversions }: ConversionChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
    >
      <h2 className="text-2xl font-bold mb-6">Stage Conversion Rates</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={stageConversions} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="stage" stroke="var(--color-muted-foreground)" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                backdropFilter: 'blur(10px)',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Conversion Rate']}
            />
            <Bar dataKey="conversion" radius={[8, 8, 0, 0]}>
              {stageConversions.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
