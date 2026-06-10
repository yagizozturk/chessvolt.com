import { Skeleton } from "@/components/ui/skeleton";

export default function UserCollectionLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-72 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
