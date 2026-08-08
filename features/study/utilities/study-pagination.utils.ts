import { STUDY_PAGE_SIZE } from "@/features/study/constants/study-pagination.constants";
import type { StudyWithPuzzleCountAndThemes } from "@/features/study/types/study";
import type { StudyFilterState } from "@/features/study/types/study-filter";
import { buildStudyFilterUrl } from "@/features/study/utilities/study-filter.utils";

export function parseStudyPage(pageParam?: string): number {
  const parsed = Number.parseInt(pageParam ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function getStudyTotalPages(totalCount: number): number {
  return totalCount > 0 ? Math.ceil(totalCount / STUDY_PAGE_SIZE) : 0;
}

export function clampStudyPage(page: number, totalPages: number): number {
  if (totalPages < 1) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}

export function paginateStudies(
  studies: StudyWithPuzzleCountAndThemes[],
  page: number,
): StudyWithPuzzleCountAndThemes[] {
  const offset = (page - 1) * STUDY_PAGE_SIZE;
  return studies.slice(offset, offset + STUDY_PAGE_SIZE);
}

export function buildStudyPageUrl(filters: StudyFilterState, page: number): string {
  const filterUrl = buildStudyFilterUrl(filters, {});
  if (page <= 1) return filterUrl;

  return `${filterUrl}${filterUrl.includes("?") ? "&" : "?"}page=${page}`;
}
