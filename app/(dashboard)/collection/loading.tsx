import {
  CollectionCardSkeleton,
  FilterControlsSkeleton,
  PageGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/page-loading/page-skeletons";

export default function CollectionLoading() {
  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* Page Header Skeleton with filter controls */}
        <PageHeaderSkeleton
          titleWidthClassName="w-40"
          descriptionWidthClassName="w-64 max-w-full"
          actions={<FilterControlsSkeleton />}
        />

        {/* Page Grid Skeleton with collection card skeleton */}
        <PageGridSkeleton>{(index) => <CollectionCardSkeleton key={index} />}</PageGridSkeleton>
      </div>
    </div>
  );
}
