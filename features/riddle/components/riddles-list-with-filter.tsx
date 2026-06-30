"use client";

import { useMemo, useState } from "react";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { RiddlesThemeFilter } from "@/features/riddle/components/riddles-theme-filter";
import {
  ATTEMPTED_RIDDLES_SORT_OPTIONS,
  DEFAULT_ATTEMPTED_RIDDLES_SORT,
  RIDDLES_THEME_FILTER_ALL,
  type AttemptedRiddlesSortBy,
} from "@/features/riddle/constants/riddles-list.constants";
import {
  filterAttemptedRiddleItems,
  sortAttemptedRiddleItems,
  type AttemptedRiddleListItem,
} from "@/features/riddle/services/riddle-list.service";
import { buildStandaloneRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import type { Theme } from "@/features/theme/types/theme";

type RiddlesListWithFilterProps = {
  themes: Theme[];
  initialItems: AttemptedRiddleListItem[];
};

export function RiddlesListWithFilter({ themes, initialItems }: RiddlesListWithFilterProps) {
  const [themeSlug, setThemeSlug] = useState(RIDDLES_THEME_FILTER_ALL);
  const [sortBy, setSortBy] = useState<AttemptedRiddlesSortBy>(DEFAULT_ATTEMPTED_RIDDLES_SORT);

  const visibleItems = useMemo(
    () => sortAttemptedRiddleItems(filterAttemptedRiddleItems(initialItems, themeSlug), sortBy),
    [initialItems, themeSlug, sortBy],
  );

  const emptyMessage =
    initialItems.length === 0
      ? "You haven't completed or failed any riddles yet."
      : "No riddles match the selected theme.";

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-muted/50 flex w-full flex-col gap-3 rounded-xl p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <RiddlesThemeFilter themes={themes} themeValue={themeSlug} onThemeChange={setThemeSlug} />

        <div className="min-w-0 flex-1 sm:max-w-64">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as AttemptedRiddlesSortBy)}
          >
            <SelectTrigger id="riddles-sort" className="w-full rounded-xl border-2" aria-label="Sort riddles">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ATTEMPTED_RIDDLES_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <EmptyDataMessage message={emptyMessage} />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {visibleItems.map(({ riddle, game, accuracyPercent, voltScore }) => (
            <RiddleBoardCard
              key={riddle.id}
              riddle={riddle}
              game={game}
              size={240}
              href={buildStandaloneRiddlePath(riddle.id)}
              displayFen={riddle.moveSequence.displayFen}
              accuracyPercent={accuracyPercent}
              voltScore={voltScore}
            />
          ))}
        </div>
      )}
    </div>
  );
}
