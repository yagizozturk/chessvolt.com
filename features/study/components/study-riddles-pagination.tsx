import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildStudyRiddlesPageUrl } from "@/features/study/utilities/study-riddles-pagination.utils";

type StudyRiddlesPaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
};

export function StudyRiddlesPagination({ basePath, page, totalPages }: StudyRiddlesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Study riddles pagination" className="flex items-center justify-center gap-3">
      {page > 1 ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildStudyRiddlesPageUrl(basePath, page - 1)}>
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
          <Link href={buildStudyRiddlesPageUrl(basePath, page + 1)}>
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
