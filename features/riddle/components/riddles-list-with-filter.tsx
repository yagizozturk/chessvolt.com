"use client";

import { useMemo, useState } from "react";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { RiddlesFilters } from "@/features/riddle/components/riddles-filters";
import {
  type AttemptedRiddlesSortBy,
  DEFAULT_ATTEMPTED_RIDDLES_SORT,
  RIDDLES_THEME_FILTER_ALL,
} from "@/features/riddle/constants/riddles-list.constants";
import {
  type AttemptedRiddleListItem,
  filterAttemptedRiddleItems,
  sortAttemptedRiddleItems,
} from "@/features/riddle/services/riddle-list.service";
import { buildStandaloneRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import type { Theme } from "@/features/theme/types/theme";
import { cn } from "@/lib/utils";

type RiddlesListWithFilterProps = {
  themes: Theme[];
  initialItems: AttemptedRiddleListItem[];
  showFilters?: boolean;
  emptyMessage?: string;
  noResultsMessage?: string;
  className?: string;
};

export function RiddlesListWithFilter({
  themes,
  initialItems,
  showFilters = true,
  emptyMessage = "You haven't completed or failed any riddles yet.",
  noResultsMessage = "No riddles match the selected theme.",
  className,
}: RiddlesListWithFilterProps) {
  const [themeSlug, setThemeSlug] = useState(RIDDLES_THEME_FILTER_ALL);
  const [sortBy, setSortBy] = useState<AttemptedRiddlesSortBy>(DEFAULT_ATTEMPTED_RIDDLES_SORT);

  const visibleItems = useMemo(
    () => sortAttemptedRiddleItems(filterAttemptedRiddleItems(initialItems, themeSlug), sortBy),
    [initialItems, themeSlug, sortBy],
  );

  const filters = showFilters && initialItems.length > 0 && (
    <RiddlesFilters
      themes={themes}
      themeValue={themeSlug}
      sortBy={sortBy}
      onThemeChange={setThemeSlug}
      onSortChange={setSortBy}
    />
  );

  if (initialItems.length === 0) {
    return (
      <div className={cn("flex flex-col gap-8", className)}>
        <EmptyDataMessage message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {filters}

      {visibleItems.length === 0 ? (
        <EmptyDataMessage message={noResultsMessage} />
      ) : (
        <div className="page-container-grid-data-layout">
          {visibleItems.map(({ riddle, game, accuracyPercent, voltScore, primaryTheme }) => (
            <RiddleBoardCard
              key={riddle.id}
              riddle={riddle}
              game={game}
              boardWrapperClassName="aspect-square w-[180px] shrink-0"
              href={buildStandaloneRiddlePath(riddle.id)}
              displayFen={riddle.moveSequence.displayFen}
              accuracyPercent={accuracyPercent}
              voltScore={voltScore}
              primaryTheme={primaryTheme}
            />
          ))}
        </div>
      )}
    </div>
  );
}
