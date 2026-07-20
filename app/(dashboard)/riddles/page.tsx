// TODO: Refactor
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { RiddlesFilters } from "@/features/riddle/components/riddles-filters";
import {
  filterAttemptedRiddleItems,
  getUserAttemptedRiddlesForDisplay,
  sortAttemptedRiddleItems,
} from "@/features/riddle/services/riddle-list.service";
import { buildStandaloneRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import {
  hasActiveRiddlesFilters,
  parseRiddlesFilterStateFromSearchParams,
} from "@/features/riddle/utilities/riddle-filter.utils";
import { getAllThemes } from "@/features/theme/services/theme.service";
import { getPublicUser } from "@/lib/supabase/auth";

type SearchParams = Promise<{ theme?: string; sort?: string }>;

export default async function RiddlesPage({ searchParams }: { searchParams: SearchParams }) {
  const { user, supabase } = await getPublicUser();
  const params = await searchParams;
  const themes = (await getAllThemes(supabase)).filter((theme) => theme.isActive);
  const items = user ? await getUserAttemptedRiddlesForDisplay(supabase, user.id) : [];
  const filterState = parseRiddlesFilterStateFromSearchParams(params);
  const visibleItems = sortAttemptedRiddleItems(
    filterAttemptedRiddleItems(items, filterState.themeFilter),
    filterState.sortBy,
  );
  const hasActiveFilters = hasActiveRiddlesFilters(filterState);
  const emptyMessage = user
    ? "You haven't completed or failed any riddles yet."
    : "Sign in to see riddles you've tried.";

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="Your riddles"
          description="Riddles you've tried to solve."
          actions={
            user && items.length > 0 ? (
              <RiddlesFilters
                themes={themes}
                themeFilter={filterState.themeFilter}
                sortBy={filterState.sortBy}
                hasActiveFilters={hasActiveFilters}
              />
            ) : undefined
          }
        />

        {items.length === 0 ? (
          <EmptyDataMessage message={emptyMessage} />
        ) : visibleItems.length === 0 ? (
          <EmptyDataMessage message="No riddles match the selected theme." />
        ) : (
          <div className="page-container-grid-data-layout">
            {visibleItems.map(({ riddle, game, accuracyPercent, primaryTheme }) => (
              <RiddleBoardCard
                key={riddle.id}
                riddle={riddle}
                game={game}
                boardWrapperClassName="aspect-square w-[180px] shrink-0"
                href={buildStandaloneRiddlePath(riddle.id)}
                displayFen={riddle.moveSequence.displayFen}
                accuracyPercent={accuracyPercent}
                primaryTheme={primaryTheme}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
