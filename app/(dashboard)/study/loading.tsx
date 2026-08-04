import {
  StudyCardSkeleton,
  FilterControlsSkeleton,
  PageGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/page-loading/page-skeletons";

export default function StudyLoading() {
  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* Page Header Skeleton with filter controls */}
        <PageHeaderSkeleton
          titleWidthClassName="w-40"
          descriptionWidthClassName="w-64 max-w-full"
          actions={<FilterControlsSkeleton />}
        />

        {/* Page Grid Skeleton with study card skeleton */}
        <PageGridSkeleton>{(index) => <StudyCardSkeleton key={index} />}</PageGridSkeleton>
      </div>
    </div>
  );
}
