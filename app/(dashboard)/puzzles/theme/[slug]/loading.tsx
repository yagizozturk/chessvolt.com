import { BoardCardSkeleton, PageGridSkeleton, PageHeaderSkeleton } from "@/components/page-loading/page-skeletons";

export default function ThemePuzzlesLoading() {
  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeaderSkeleton />
        <PageGridSkeleton count={4}>{(index) => <BoardCardSkeleton key={index} metaLineCount={3} />}</PageGridSkeleton>
      </div>
    </div>
  );
}
