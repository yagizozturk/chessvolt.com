// TODO: Refactor
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
        <PageHeaderSkeleton
          titleWidthClassName="w-40"
          descriptionWidthClassName="w-64 max-w-full"
          actions={<FilterControlsSkeleton />}
        />

        <PageGridSkeleton>{(index) => <CollectionCardSkeleton key={index} />}</PageGridSkeleton>
      </div>
    </div>
  );
}
