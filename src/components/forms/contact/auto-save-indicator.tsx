import { Clock } from 'lucide-react'

interface AutoSaveIndicatorProps {
  enabled: boolean
  isAutoSaving?: boolean
  lastSaved?: string | number
}

export function AutoSaveIndicator({ enabled, isAutoSaving, lastSaved }: AutoSaveIndicatorProps) {
  if (!enabled) return null

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Clock className="h-3 w-3" />
      <span>
        {isAutoSaving 
          ? 'Saving...'
          : lastSaved
          ? `Saved ${new Date(lastSaved).toLocaleTimeString()}`
          : 'Auto-save enabled'
        }
      </span>
    </div>
  )
}