'use client'

import { m as motion } from 'framer-motion'
import { Clock, Target, Award } from 'lucide-react'

export function AutomationTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 mb-12"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Automated Commission Processing System</h2>
        <p className="text-muted-foreground">Real-time commission calculation and payout automation with 87.5% efficiency improvement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            Processing Automation
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Time:</span>
              <span className="font-medium">2.3 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Previous Time:</span>
              <span className="font-medium text-muted-foreground">8.5 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Savings:</span>
              <span className="font-medium text-success">73% faster</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-success" />
            Accuracy Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Calculation Accuracy:</span>
              <span className="font-medium">99.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Error Reduction:</span>
              <span className="font-medium text-success">95% fewer errors</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dispute Rate:</span>
              <span className="font-medium">1.2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-400" />
            Partner Satisfaction
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Satisfaction Score:</span>
              <span className="font-medium">94.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Improvement:</span>
              <span className="font-medium text-success">+19%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Response Time:</span>
              <span className="font-medium">&lt; 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
