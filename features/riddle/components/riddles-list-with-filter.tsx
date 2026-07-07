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
  title?: string;
  description?: string;
  emptyMessage?: string;
  noResultsMessage?: string;
  className?: string;
};

export function RiddlesListWithFilter({
  themes,
  initialItems,
  showFilters = true,
  title = "Your riddles",
  description = "Riddles you've tried to solve.",
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

  const header = (
    <div className="flex flex-col gap-4 rounded-xl bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)] p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {showFilters && initialItems.length > 0 && (
        <RiddlesFilters
          variant="inline"
          themes={themes}
          themeValue={themeSlug}
          sortBy={sortBy}
          onThemeChange={setThemeSlug}
          onSortChange={setSortBy}
        />
      )}
    </div>
  );

  if (initialItems.length === 0) {
    return (
      <div className={cn("page-container-children-layout", className)}>
        {header}
        <EmptyDataMessage message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="page-container-children-layout">
      {header}

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
