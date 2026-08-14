import { THEME_PUZZLES_PAGE_SIZE } from "@/features/theme/constants/theme-puzzles-pagination.constants";

export function getThemePuzzlesPageParam(pageParam?: string): number {
  const parsed = Number.parseInt(pageParam ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

export function clampThemePuzzlesPage(page: number, totalPages: number): number {
  if (totalPages < 1) return 1;
  return Math.min(Math.max(1, page), totalPages);
}

export function getThemePuzzlesTotalPages(totalCount: number, pageSize = THEME_PUZZLES_PAGE_SIZE): number {
  if (totalCount <= 0) return 0;
  return Math.ceil(totalCount / pageSize);
}

export function buildThemePuzzlesPageUrl(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  return `${basePath}?page=${page}`;
}
