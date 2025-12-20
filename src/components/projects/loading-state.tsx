export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64" role="status" aria-label="Loading">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent" />
      </div>
    </div>
  )
}
