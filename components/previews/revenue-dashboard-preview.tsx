'use client'

import { Card } from '@/components/ui/card'

export function RevenueDashboardPreview() {
  // TODO: UPDATE FOR A PRODUCTION IMPLEMENTATION
  // This could be a simplified version of your actual project component
  // Optimized for display in a small preview area
  return (
    <div className="from-primary/20 flex h-full w-full items-center justify-center bg-gradient-to-br to-[var(--muted)] p-4">
      <Card className="card w-full max-w-md p-3">
        <div className="bg-primary/30 mb-3 h-6 w-24 rounded-[var(--radius)]"></div>
        <div className="space-y-2">
          <div className="h-24 rounded-[var(--radius)] bg-[var(--muted-foreground)]/10"></div>
          <div className="flex justify-between">
            <div className="bg-primary/20 h-4 w-12 rounded-[var(--radius)]"></div>
            <div className="bg-primary/20 h-4 w-12 rounded-[var(--radius)]"></div>
            <div className="bg-primary/20 h-4 w-12 rounded-[var(--radius)]"></div>
          </div>
        </div>
      </Card>
    </div>
  )
}
