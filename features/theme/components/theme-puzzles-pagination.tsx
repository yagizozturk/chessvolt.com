import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildThemePuzzlesPageUrl } from "@/features/theme/utilities/theme-puzzles-pagination.utils";

type ThemePuzzlesPaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
};

export function ThemePuzzlesPagination({ basePath, page, totalPages }: ThemePuzzlesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Theme puzzles pagination" className="flex items-center justify-center gap-3">
      {page > 1 ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildThemePuzzlesPageUrl(basePath, page - 1)}>
            <ChevronLeftIcon data-icon="inline-start" />
            Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeftIcon data-icon="inline-start" />
          Previous
        </Button>
      )}
      <span className="text-muted-foreground text-sm">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildThemePuzzlesPageUrl(basePath, page + 1)}>
            Next
            <ChevronRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Next
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
      )}
    </nav>
  );
}
