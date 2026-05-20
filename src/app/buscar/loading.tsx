import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <Skeleton className="h-10 w-full max-w-xl mb-8" />
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
