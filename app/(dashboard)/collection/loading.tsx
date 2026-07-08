import {
  CollectionCardSkeleton,
  FilterControlsSkeleton,
  PageGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/page-loading/page-skeletons";

export default function CollectionLoading() {
  return (
    <div className="page-container">
      <div className="page-container-list-layout">
        <PageHeaderSkeleton
          titleWidthClassName="w-40"
          descriptionWidthClassName="w-64 max-w-full"
          actions={
            <FilterControlsSkeleton widths={["sm:max-w-56", "sm:max-w-64", "lg:max-w-xs lg:flex-1"]} />
          }
        />

        <PageGridSkeleton>{(index) => <CollectionCardSkeleton key={index} />}</PageGridSkeleton>
      </div>
    </div>
  );
}
