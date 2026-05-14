import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function AuthedLoading() {
  return (
    <div className="space-y-6 py-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <SkeletonText lines={4} />
    </div>
  );
}
