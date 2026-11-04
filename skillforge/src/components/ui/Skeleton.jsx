import { cn } from '../../utils/cn';

export const Skeleton = ({ className }) => (
  <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-subtle', className)} />
);

export const StatSkeleton = () => (
  <div className="rounded-xl border border-line bg-surface p-5 shadow-card" aria-hidden="true">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="mt-4 h-7 w-16" />
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-xl border border-line bg-surface p-5 shadow-card" aria-hidden="true">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="mt-3 h-3 w-full" />
    <Skeleton className="mt-2 h-3 w-2/3" />
    <Skeleton className="mt-5 h-7 w-24" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div
    role="status"
    aria-label="Loading"
    className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-card"
  >
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-5 py-4">
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    ))}
  </div>
);
