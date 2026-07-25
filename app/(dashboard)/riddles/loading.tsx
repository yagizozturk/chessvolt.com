import {
  FilterControlsSkeleton,
  PageHeaderSkeleton,
  ThemeListSkeleton,
} from "@/components/page-loading/page-skeletons";

export default function RiddlesLoading() {
  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeaderSkeleton
          titleWidthClassName="w-40"
          descriptionWidthClassName="w-72 max-w-full"
          actions={<FilterControlsSkeleton widths={["sm:max-w-xs sm:flex-1"]} />}
        />

        <ThemeListSkeleton />
      </div>
    </div>
  );
}
