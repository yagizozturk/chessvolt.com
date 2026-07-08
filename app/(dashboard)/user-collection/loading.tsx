import { CollectionCardSkeleton, PageHeaderSkeleton } from "@/components/page-loading/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserCollectionLoading() {
  return (
    <div className="page-container">
      <div className="page-container-list-layout">
        <PageHeaderSkeleton titleWidthClassName="w-48" descriptionWidthClassName="w-80 max-w-full" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <CollectionCardSkeleton key={index} />
          ))}
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-44 max-w-full" />
        </div>
      </div>
    </div>
  );
}
