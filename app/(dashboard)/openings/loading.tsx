import { Skeleton } from "@/components/ui/skeleton";

function OpeningBoardCardSkeleton() {
  return (
    <div className="flex flex-row items-stretch gap-6 rounded-lg p-6">
      <Skeleton className="size-[240px] shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="mt-auto ml-auto h-9 w-16" />
      </div>
    </div>
  );
}

export default function OpeningsLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10">
      <div className="flex flex-col gap-8">
        <div className="flex gap-2 rounded-lg bg-[#113DC4]">
          <div className="min-w-0 flex-1 space-y-2 p-4">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-9 w-80 max-w-full" />
            <div className="mt-4 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-7 w-16 rounded-full" />
              ))}
            </div>
          </div>
          <Skeleton className="h-[200px] w-[268px] shrink-0 rounded-lg" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <OpeningBoardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
