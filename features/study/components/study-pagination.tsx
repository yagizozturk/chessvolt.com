import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { StudyFilterState } from "@/features/study/types/study-filter";
import { buildStudyPageUrl } from "@/features/study/utilities/study-pagination.utils";

type StudyPaginationProps = {
  filters: StudyFilterState;
  page: number;
  totalPages: number;
};

export function StudyPagination({ filters, page, totalPages }: StudyPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Studies pagination" className="flex items-center justify-center gap-3">
      {page > 1 ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildStudyPageUrl(filters, page - 1)}>
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
          <Link href={buildStudyPageUrl(filters, page + 1)}>
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
