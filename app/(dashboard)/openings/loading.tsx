import { Skeleton } from "@/components/ui/skeleton";

export default function OpeningsLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 pt-12 pb-16">
      <div className="grid grid-cols-2 gap-6 px-2 py-3 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
