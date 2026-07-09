// TODO: Refactor
import {
  BoardCardSkeleton,
  FilterControlsSkeleton,
  PageHeaderSkeleton,
} from "@/components/page-loading/page-skeletons";

export default function OpeningsLoading() {
  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeaderSkeleton
          titleWidthClassName="w-72 max-w-full"
          descriptionWidthClassName="w-64 max-w-full"
          actions={<FilterControlsSkeleton widths={["sm:max-w-56"]} />}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <BoardCardSkeleton key={index} metaLineCount={2} />
          ))}
        </div>
      </div>
    </div>
  );
}
