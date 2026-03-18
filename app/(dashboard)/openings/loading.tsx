import { Skeleton } from "@/components/ui/skeleton";

export default function OpeningsLoading() {
  return (
    <div className="container mx-auto max-w-3xl p-8">
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
