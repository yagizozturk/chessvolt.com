// TODO: Refactor
import {
  BoardCardSkeleton,
  FilterControlsSkeleton,
  PageGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/page-loading/page-skeletons";

export default function RiddlesLoading() {
  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeaderSkeleton
          titleWidthClassName="w-40"
          descriptionWidthClassName="w-64 max-w-full"
          actions={<FilterControlsSkeleton widths={["sm:w-64", "sm:w-64"]} />}
        />

        <PageGridSkeleton>{(index) => <BoardCardSkeleton key={index} compact metaLineCount={3} />}</PageGridSkeleton>
      </div>
    </div>
  );
}
