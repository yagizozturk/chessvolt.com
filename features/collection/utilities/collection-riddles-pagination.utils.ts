import { COLLECTION_RIDDLES_PAGE_SIZE } from "@/features/collection/constants/collection-riddles-pagination.constants";

export function parseCollectionRiddlesPage(pageParam?: string): number {
  const parsed = Number.parseInt(pageParam ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

export function clampCollectionRiddlesPage(page: number, totalPages: number): number {
  if (totalPages < 1) return 1;
  return Math.min(Math.max(1, page), totalPages);
}

export function getCollectionRiddlesTotalPages(totalCount: number, pageSize = COLLECTION_RIDDLES_PAGE_SIZE): number {
  if (totalCount <= 0) return 0;
  return Math.ceil(totalCount / pageSize);
}

export function buildCollectionRiddlesPageUrl(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  return `${basePath}?page=${page}`;
}
