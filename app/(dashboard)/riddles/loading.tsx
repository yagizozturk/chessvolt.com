import { Skeleton } from "@/components/ui/skeleton";

function RiddleBoardCardSkeleton() {
  return (
    <div className="flex flex-row items-stretch gap-6 rounded-lg p-6">
      <Skeleton className="size-[240px] shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-auto h-9 w-16" />
      </div>
    </div>
  );
}

export default function RiddlesLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-xl bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
            <Skeleton className="h-10 w-full rounded-xl sm:max-w-64" />
            <Skeleton className="h-10 w-full rounded-xl sm:max-w-56" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <RiddleBoardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
