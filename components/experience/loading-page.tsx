import { Loader2 } from "lucide-react"

export function LoadingPage() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}

