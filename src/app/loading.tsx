'use client'



export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div
        className="flex flex-col items-center"
      >
        <div className="relative w-16 h-16">
          <div
            className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent"
          />
        </div>
        <p className="mt-4 text-muted-foreground dark:text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}