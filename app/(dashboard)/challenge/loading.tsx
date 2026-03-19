import { Skeleton } from "@/components/ui/skeleton";

export default function ChallengeLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10 pb-16">
      <div className="space-y-6">
        {[1, 2].map((group) => (
          <div key={group} className="overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-2 py-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-[150px] w-[150px] shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full max-w-sm" />
                  <Skeleton className="h-12 w-full max-w-md" />
                </div>
              </div>
              <Skeleton className="h-[88px] w-44 shrink-0 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-6 px-2 py-3 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
