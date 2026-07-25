import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { CollectionFilterState } from "@/features/collection/types/collection-filter";
import { buildCollectionPageUrl } from "@/features/collection/utilities/collection-pagination.utils";

type CollectionPaginationProps = {
  filters: CollectionFilterState;
  page: number;
  totalPages: number;
};

export function CollectionPagination({ filters, page, totalPages }: CollectionPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Collections pagination" className="flex items-center justify-center gap-3">
      {page > 1 ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildCollectionPageUrl(filters, page - 1)}>
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
          <Link href={buildCollectionPageUrl(filters, page + 1)}>
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
