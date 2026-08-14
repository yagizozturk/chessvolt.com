import { EmptyState } from "@/components/empty-state/empty-state";
import { PageHeaderWithImage } from "@/components/page-header";
import { StudyPuzzlesPagination } from "@/features/study/components/study-puzzles-pagination";
import { loadStudyPuzzles } from "@/features/study/loaders/study-puzzles-page.loader";
import { getStudyCoverImageSrc } from "@/features/study/utilities/study-cover-image.utils";
import { getPaginationParams } from "@/features/study/utilities/study-puzzles-pagination.utils";
import { PuzzleBoardCard } from "@/features/puzzle/components/puzzle-board-card";
import { getPublicUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function StudyDetailPage({ params, searchParams }: Props) {
  const { user, supabase } = await getPublicUser();
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = getPaginationParams(pageParam);

  // ==================================================================
  // Getting all study puzzles from loader
  // ==================================================================
  const { study, studyPuzzles, pagination } = await loadStudyPuzzles({
    supabase,
    user,
    slug,
    pagination: page,
  });

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* Page Header with Study Image */}
        <PageHeaderWithImage
          title={study.title}
          description={study.description}
          imageSrc={getStudyCoverImageSrc(study.coverImageUrl)}
        />

        {/* Check If there are studies, if not, empty state */}
        {pagination?.totalPuzzleCount === 0 && <EmptyState message="No puzzles found in this study." />}

        {/* If there are studies, display them in a grid */}
        <div className="page-container-grid-data-layout">
          {studyPuzzles.map(({ puzzle, game, href, displayFen, accuracyPercent, primaryTheme, isComplete }) => (
            <PuzzleBoardCard
              key={puzzle.id}
              puzzle={puzzle}
              game={game}
              href={href}
              displayFen={displayFen}
              accuracyPercent={accuracyPercent}
              primaryTheme={primaryTheme}
              isComplete={isComplete}
            />
          ))}
        </div>

        {/* If there are studies and pages, display the pagination navigator */}
        {pagination ? (
          <StudyPuzzlesPagination
            basePath={`/study/${slug}`}
            page={pagination.page}
            totalPages={pagination.totalPages}
          />
        ) : null}
      </div>
    </div>
  );
}
