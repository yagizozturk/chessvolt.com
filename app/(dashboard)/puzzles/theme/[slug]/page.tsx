import { EmptyState } from "@/components/empty-state/empty-state";
import { PageHeader } from "@/components/page-header";
import { PuzzleBoardCard } from "@/features/puzzle/components/puzzle-board-card";
import { buildThemePuzzlesUrl } from "@/features/puzzle/utilities/build-puzzle-url";
import { ThemePuzzlesPagination } from "@/features/theme/components/theme-puzzles-pagination";
import { loadThemePuzzles } from "@/features/theme/loaders/theme-puzzles-page.loader";
import { getThemePuzzlesPageParam } from "@/features/theme/utilities/theme-puzzles-pagination.utils";
import { getPublicUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function ThemePuzzlesPage({ params, searchParams }: Props) {
  const { user, supabase } = await getPublicUser();
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = getThemePuzzlesPageParam(pageParam);

  const { theme, themePuzzles, pagination } = await loadThemePuzzles({
    supabase,
    user,
    slug,
    pagination: page,
  });

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader title={theme.title} description={theme.description ?? ""} />

        {pagination?.totalPuzzleCount === 0 && <EmptyState message="No puzzles found in this theme." />}

        <div className="page-container-grid-data-layout">
          {themePuzzles.map(
            ({ puzzle, game, href, displayFen, accuracyPercent, primaryTheme, isComplete, showVoltScore, voltScore }) => (
              <PuzzleBoardCard
                key={puzzle.id}
                puzzle={puzzle}
                game={game}
                href={href}
                displayFen={displayFen}
                accuracyPercent={accuracyPercent}
                primaryTheme={primaryTheme}
                isComplete={isComplete}
                showVoltScore={showVoltScore}
                voltScore={voltScore}
              />
            ),
          )}
        </div>

        {pagination ? (
          <ThemePuzzlesPagination
            basePath={buildThemePuzzlesUrl(slug)}
            page={pagination.page}
            totalPages={pagination.totalPages}
          />
        ) : null}
      </div>
    </div>
  );
}
