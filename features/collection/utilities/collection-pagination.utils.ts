import { COLLECTION_PAGE_SIZE } from "@/features/collection/constants/collection-pagination.constants";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import type { CollectionFilterState } from "@/features/collection/types/collection-filter";
import { buildCollectionFilterUrl } from "@/features/collection/utilities/collection-filter.utils";

export function parseCollectionPage(pageParam?: string): number {
  const parsed = Number.parseInt(pageParam ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function getCollectionTotalPages(totalCount: number): number {
  return totalCount > 0 ? Math.ceil(totalCount / COLLECTION_PAGE_SIZE) : 0;
}

export function clampCollectionPage(page: number, totalPages: number): number {
  if (totalPages < 1) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}

export function paginateCollections(
  collections: CollectionWithRiddleCountAndThemes[],
  page: number,
): CollectionWithRiddleCountAndThemes[] {
  const offset = (page - 1) * COLLECTION_PAGE_SIZE;
  return collections.slice(offset, offset + COLLECTION_PAGE_SIZE);
}

export function buildCollectionPageUrl(filters: CollectionFilterState, page: number): string {
  const filterUrl = buildCollectionFilterUrl(filters, {});
  if (page <= 1) return filterUrl;

  return `${filterUrl}${filterUrl.includes("?") ? "&" : "?"}page=${page}`;
}
