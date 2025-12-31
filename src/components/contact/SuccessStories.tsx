'use client'

import { CheckCircle } from 'lucide-react'

// ============================================================================
// Component
// ============================================================================

export function SuccessStories() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
      <h4 className="typography-large mb-4 text-primary">Career Highlights</h4>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <span>$4.8M+ revenue impact</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <span>432% transaction growth</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <span>2,217% network expansion</span>
        </div>
      </div>
      <div className="mt-4 typography-small text-muted-foreground">
        Proven results from previous roles
      </div>
    </div>
  )
}
