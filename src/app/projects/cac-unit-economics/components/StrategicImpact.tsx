'use client'

import { m as motion } from 'framer-motion'

export function StrategicImpact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-success/20 rounded-3xl p-6"
    >
      <h2 className="text-xl font-bold mb-4 text-success">Proven Revenue Operations Impact & ROI Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">32%</div>
          <div className="text-xs text-muted-foreground">CAC Reduction Through Strategic Partner Channel Optimization</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-1">3.6:1</div>
          <div className="text-xs text-muted-foreground">Industry-Leading LTV:CAC Efficiency Ratio (Benchmark: 3:1+)</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">8.4 mo</div>
          <div className="text-xs text-muted-foreground">Optimized Customer Payback Period (Target: &lt;12mo)</div>
        </div>
      </div>
    </motion.div>
  )
}
