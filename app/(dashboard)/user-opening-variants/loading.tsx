import { Skeleton } from "@/components/ui/skeleton";

export default function UserOpeningVariantsLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-52 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
