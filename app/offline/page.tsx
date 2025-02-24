export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="container flex max-w-2xl flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold">You're Offline</h1>
        <p className="text-muted-foreground">Please check your internet connection and try again.</p>
      </div>
    </div>
  )
}

