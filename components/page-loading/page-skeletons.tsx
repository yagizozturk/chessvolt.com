// TODO: Refactor
import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PAGE_HEADER_GRADIENT = "bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)]";

type PageHeaderSkeletonProps = {
  titleWidthClassName?: string;
  descriptionWidthClassName?: string;
  actions?: ReactNode;
};

/** Mirrors `PageHeader` layout (stacks on mobile, row on lg). */
export function PageHeaderSkeleton({
  titleWidthClassName = "w-40",
  descriptionWidthClassName = "w-64",
  actions,
}: PageHeaderSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl p-6 lg:flex-row lg:items-center lg:justify-between",
        PAGE_HEADER_GRADIENT,
      )}
    >
      <div className="flex min-w-0 flex-col gap-2">
        <Skeleton className={cn("h-6 max-w-full md:h-8", titleWidthClassName)} />
        <Skeleton className={cn("h-4 max-w-full", descriptionWidthClassName)} />
      </div>
      {actions ? <div className="w-full lg:w-auto">{actions}</div> : null}
    </div>
  );
}

/** Mirrors `PageHeaderWithImage` (description hidden below md; image shrinks on mobile). */
export function PageHeaderWithImageSkeleton({
  titleWidthClassName = "w-48",
  descriptionWidthClassName = "w-72",
}: Pick<PageHeaderSkeletonProps, "titleWidthClassName" | "descriptionWidthClassName">) {
  return (
    <div className={cn("flex items-center gap-2 rounded-xl sm:gap-4", PAGE_HEADER_GRADIENT)}>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-6">
        <Skeleton className={cn("h-6 max-w-full md:h-8", titleWidthClassName)} />
        <Skeleton className={cn("hidden h-4 max-w-full md:block", descriptionWidthClassName)} />
      </div>
      <Skeleton className="h-[100px] w-[110px] shrink-0 rounded-r-xl sm:h-[180px] sm:w-[200px]" />
    </div>
  );
}

/** Filter / select row used in `PageHeader` actions. */
export function FilterControlsSkeleton({ widths = ["sm:max-w-56", "sm:max-w-64"] }: { widths?: string[] }) {
  return (
    <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
      {widths.map((widthClassName, index) => (
        <Skeleton key={index} className={cn("h-10 w-full rounded-xl", widthClassName)} />
      ))}
    </div>
  );
}

type BoardCardSkeletonProps = {
  /** Matches list pages that pass `w-[180px]` vs default `w-[240px]`. */
  compact?: boolean;
  metaLineCount?: number;
};

/** Mirrors `RiddleBoardCard` / `OpeningBoardCard` with a smaller board on mobile. */
export function BoardCardSkeleton({ compact = false, metaLineCount = 2 }: BoardCardSkeletonProps) {
  return (
    <div className="bg-card border-b-card-shadow flex flex-row items-stretch gap-3 rounded-lg border-b-[6px] p-3 sm:gap-6 sm:p-6">
      <Skeleton
        className={cn(
          "aspect-square shrink-0 self-start rounded-lg",
          compact ? "w-[120px] sm:w-[180px]" : "w-[120px] sm:w-[240px]",
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-6 w-3/4 sm:h-7" />
        {Array.from({ length: metaLineCount }, (_, index) => (
          <Skeleton key={index} className={cn("h-4", index === 0 ? "w-full" : index === 1 ? "w-2/3" : "w-1/2")} />
        ))}
        <Skeleton className="mt-auto h-8 w-14 sm:h-9 sm:w-16" />
      </div>
    </div>
  );
}

/** Mirrors collection cover cards (image + title block). */
export function CollectionCardSkeleton() {
  return (
    <div className="bg-card border-b-card-shadow flex flex-col overflow-hidden rounded-lg border-b-[6px]">
      <Skeleton className="h-[100px] w-full rounded-t-lg sm:h-[200px]" />
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-6">
        <Skeleton className="h-7 w-3/4 sm:h-9" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="hidden h-4 w-5/6 sm:block" />
        <Skeleton className="mt-auto ml-auto h-8 w-14 sm:h-9 sm:w-16" />
      </div>
    </div>
  );
}

export function PageGridSkeleton({ count = 4, children }: { count?: number; children: (index: number) => ReactNode }) {
  return (
    <div className="page-container-grid-data-layout">
      {Array.from({ length: count }, (_, index) => children(index))}
    </div>
  );
}
