import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* Hero Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" variant="text" />
        <Skeleton className="h-6 w-2/3 max-w-xl" variant="text" />
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    </div>
  );
}
