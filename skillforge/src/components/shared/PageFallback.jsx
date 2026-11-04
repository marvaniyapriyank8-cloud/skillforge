import { Skeleton, StatSkeleton } from '../ui/Skeleton';

/** Shown while a lazily-loaded page chunk is downloading. */
export const PageFallback = () => (
  <div role="status" aria-label="Loading page">
    <Skeleton className="h-7 w-48" />
    <Skeleton className="mt-2 h-4 w-72" />
    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
    </div>
  </div>
);
