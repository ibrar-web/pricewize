"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function BrandSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 h-full flex flex-col gap-4">
      {/* Brand Name Skeleton */}
      <div className="flex-1">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Categories Skeleton */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* CTA Skeleton */}
      <Skeleton className="h-4 w-12" />
    </div>
  );
}

export function BrandGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <BrandSkeleton key={i} />
      ))}
    </div>
  );
}

