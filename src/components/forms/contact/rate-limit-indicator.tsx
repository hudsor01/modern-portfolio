import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'

interface RateLimitData {
  remaining: number
  limit: number
  blocked: boolean
}

interface RateLimitIndicatorProps {
  enabled: boolean
  data?: RateLimitData
}

export function RateLimitIndicator({ enabled, data }: RateLimitIndicatorProps) {
  if (!enabled || !data) return null

  const { remaining, limit, blocked } = data

  return (
    <Badge 
      variant={blocked ? 'destructive' : remaining <= 2 ? 'secondary' : 'outline'}
      className="flex items-center gap-1"
    >
      <Shield className="h-3 w-3" />
      {blocked 
        ? 'Rate limit exceeded'
        : `${remaining}/${limit} messages remaining`
      }
    </Badge>
  )
}