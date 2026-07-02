import { Skeleton } from "@/components/ui/skeleton";

export default function UserCollectionLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 rounded-xl bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)] p-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-lg">
              <Skeleton className="h-[200px] w-full rounded-none rounded-t-lg" />
              <div className="flex flex-col gap-3 p-6">
                <Skeleton className="h-9 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="mt-auto ml-auto h-9 w-16" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
