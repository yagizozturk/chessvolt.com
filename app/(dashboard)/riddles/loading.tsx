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
      <div className="page-container-list-layout">
        <PageHeaderSkeleton
          titleWidthClassName="w-40"
          descriptionWidthClassName="w-64 max-w-full"
          actions={<FilterControlsSkeleton widths={["sm:max-w-64", "lg:max-w-64"]} />}
        />

        <PageGridSkeleton>
          {(index) => <BoardCardSkeleton key={index} compact metaLineCount={3} />}
        </PageGridSkeleton>
      </div>
    </div>
  );
}
