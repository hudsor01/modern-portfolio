import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-4">
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </Card>
  )
}

