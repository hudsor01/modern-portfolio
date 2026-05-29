'use client'

import { CheckCircle } from 'lucide-react'
import { REVENUE_IMPACT, TRANSACTION_GROWTH, NETWORK_GROWTH } from '@/lib/stats'

// ============================================================================
// Component
// ============================================================================

export function SuccessStories() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
      <h4 className="typography-large mb-4 text-primary">Recent Success</h4>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <span>{REVENUE_IMPACT} revenue generated</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <span>{TRANSACTION_GROWTH} transaction growth</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <span>{NETWORK_GROWTH} network expansion</span>
        </div>
      </div>
      <div className="mt-4 typography-small text-muted-foreground">
        Real results from recent partnerships
      </div>
    </div>
  )
}
