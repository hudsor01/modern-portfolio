'use client'

import { Card } from '@/components/ui/card'

export function RevenueDashboardPreview() {
  // This could be a simplified version of your actual project component
  // Optimized for display in a small preview area
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-[var(--muted)] p-4">
      <Card className="w-full max-w-md p-3 card">
        <div className="h-6 w-24 rounded-[var(--radius)] bg-primary/30 mb-3"></div>
        <div className="space-y-2">
          <div className="h-24 bg-[var(--muted-foreground)]/10 rounded-[var(--radius)]"></div>
          <div className="flex justify-between">
            <div className="h-4 w-12 bg-primary/20 rounded-[var(--radius)]"></div>
            <div className="h-4 w-12 bg-primary/20 rounded-[var(--radius)]"></div>
            <div className="h-4 w-12 bg-primary/20 rounded-[var(--radius)]"></div>
          </div>
        </div>
      </Card>
    </div>
  )
}
