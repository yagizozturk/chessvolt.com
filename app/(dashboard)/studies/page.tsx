import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header";
import { StudyCard } from "@/features/study/components/study-card";
import { StudyFilters } from "@/features/study/components/study-filters";
import { StudyPagination } from "@/features/study/components/study-pagination";
import { getActiveStudiesWithPuzzleCountAndThemes } from "@/features/study/services/study.service";
import type { StudyPageSearchParams } from "@/features/study/types/study-search-params";
import {
  filterStudies,
  getThemeFilterOptions,
  hasActiveStudyFilters,
  parseStudyFilterStateFromUrl,
} from "@/features/study/utilities/study-filter.utils";
import {
  clampStudyPage,
  getStudyTotalPages,
  paginateStudies,
  parseStudyPage,
} from "@/features/study/utilities/study-pagination.utils";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function StudyPage({ searchParams }: { searchParams: StudyPageSearchParams }) {
  const { supabase } = await getPublicUser();
  const params = await searchParams;

  // ========================================================================
  // Get active studies with puzzle count and themes
  // ========================================================================
  const studies = await getActiveStudiesWithPuzzleCountAndThemes(supabase);

  // ========================================================================
  // Parse study filter state from theme filter, difficulty filter and
  // search textbox params
  // ========================================================================
  const filterState = parseStudyFilterStateFromUrl(params);

  // ========================================================================
  // Get theme filter options. If studies dont have a theme,
  // theme will not appear
  // ========================================================================
  const themeOptions = getThemeFilterOptions(studies);

  // ========================================================================
  // Filter studies based on filter state
  // ========================================================================
  const filteredStudies = filterStudies(studies, filterState);
  const totalPages = getStudyTotalPages(filteredStudies.length);
  const currentPage = clampStudyPage(parseStudyPage(params.page), totalPages);
  const paginatedStudies = paginateStudies(filteredStudies, currentPage);

  // ========================================================================
  // Check if there are active filters. This is for to show or hide
  // "Clear Filters" button. If there are any active filter, user can clear
  // ========================================================================
  const hasActiveFilters = hasActiveStudyFilters(filterState);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* Page header */}
        <PageHeader
          title="Studies"
          description="Explore curated puzzle studies."
          actions={
            studies.length > 0 ? (
              <StudyFilters
                themeOptions={themeOptions}
                searchQuery={filterState.searchQuery}
                difficultyFilter={filterState.difficultyFilter}
                themeFilter={filterState.themeFilter}
                hasActiveFilters={hasActiveFilters}
              />
            ) : undefined
          }
        />

        {/* Studies list */}
        {studies.length === 0 ? (
          <EmptyDataMessage message="No studies available yet." />
        ) : filteredStudies.length === 0 ? (
          <EmptyDataMessage message="No studies match your filters." />
        ) : (
          <>
            <div className="page-container-grid-data-layout">
              {paginatedStudies.map((study) => (
                <StudyCard key={study.id} study={study} />
              ))}
            </div>
            <StudyPagination filters={filterState} page={currentPage} totalPages={totalPages} />
          </>
        )}
      </div>
    </div>
  );
}
