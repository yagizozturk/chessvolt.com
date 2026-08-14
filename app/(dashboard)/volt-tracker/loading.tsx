import {
  BoardCardSkeleton,
  FilterControlsSkeleton,
  PageGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/page-loading/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function VoltTrackerLoading() {
  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeaderSkeleton
          titleWidthClassName="w-40"
          descriptionWidthClassName="w-72 max-w-full"
          actions={<FilterControlsSkeleton widths={["sm:w-56"]} />}
        />

        <div className="flex flex-col gap-8">
          <div>
            <Skeleton className="mb-3 h-7 w-24" />
            <PageGridSkeleton count={2}>{(index) => <BoardCardSkeleton key={index} />}</PageGridSkeleton>
          </div>
          <div>
            <Skeleton className="mb-3 h-7 w-20" />
            <PageGridSkeleton count={2}>{(index) => <BoardCardSkeleton key={index} />}</PageGridSkeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
