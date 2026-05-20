import { SkeletonGrid, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-10 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-8" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ))}
      </div>

      <Skeleton className="h-6 w-48 mb-3" />
      <SkeletonGrid count={9} />
    </div>
  );
}
