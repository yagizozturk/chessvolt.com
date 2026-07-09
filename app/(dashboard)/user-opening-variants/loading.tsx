import {
  BoardCardSkeleton,
  PageGridSkeleton,
  PageHeaderWithImageSkeleton,
} from "@/components/page-loading/page-skeletons";

export default function UserOpeningVariantsLoading() {
  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeaderWithImageSkeleton titleWidthClassName="w-48" descriptionWidthClassName="w-72 max-w-full" />

        <PageGridSkeleton>{(index) => <BoardCardSkeleton key={index} compact metaLineCount={2} />}</PageGridSkeleton>
      </div>
    </div>
  );
}
