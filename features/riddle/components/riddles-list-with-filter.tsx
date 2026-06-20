"use client";

import { useCallback, useState, useTransition } from "react";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Spinner } from "@/components/ui/spinner";
import { getRandomRiddlesAction } from "@/features/riddle/actions/get-random-riddles";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { RiddlesThemeFilter } from "@/features/riddle/components/riddles-theme-filter";
import {
  DEFAULT_RIDDLES_LIST_FILTERS,
  type RiddlesListFilters,
} from "@/features/riddle/constants/riddles-list.constants";
import type { RiddleListItem } from "@/features/riddle/services/riddle-list.service";
import { buildStandaloneRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import type { RiddleRatingBand } from "@/features/riddle/types/riddle-rating";
import type { Theme } from "@/features/theme/types/theme";
import { cn } from "@/lib/utils";

type RiddlesListWithFilterProps = {
  themes: Theme[];
  initialItems: RiddleListItem[];
};

export function RiddlesListWithFilter({ themes, initialItems }: RiddlesListWithFilterProps) {
  const [filters, setFilters] = useState<RiddlesListFilters>(DEFAULT_RIDDLES_LIST_FILTERS);
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  const fetchRiddles = useCallback((nextFilters: RiddlesListFilters) => {
    startTransition(async () => {
      const nextItems = await getRandomRiddlesAction(nextFilters);
      setItems(nextItems);
    });
  }, []);

  const handleThemeChange = (themeSlug: string) => {
    const nextFilters = { ...filters, themeSlug };
    setFilters(nextFilters);
    fetchRiddles(nextFilters);
  };

  const handleRatingChange = (ratingBand: RiddleRatingBand) => {
    const nextFilters = { ...filters, ratingBand };
    setFilters(nextFilters);
    fetchRiddles(nextFilters);
  };

  return (
    <div className="flex flex-col gap-6">
      <RiddlesThemeFilter
        themes={themes}
        themeValue={filters.themeSlug}
        ratingValue={filters.ratingBand}
        onThemeChange={handleThemeChange}
        onRatingChange={handleRatingChange}
      />

      <div className="relative">
        {isPending ? (
          <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center rounded-xl">
            <Spinner className="size-8" />
          </div>
        ) : null}

        {items.length === 0 ? (
          <EmptyDataMessage message="No riddles match your filters." />
        ) : (
          <div className={cn("grid grid-cols-2 gap-6", isPending && "pointer-events-none opacity-60")}>
            {items.map(({ riddle, game }) => (
              <RiddleBoardCard
                key={riddle.id}
                riddle={riddle}
                game={game}
                size={240}
                href={buildStandaloneRiddlePath(riddle.id)}
                displayFen={riddle.moveSequence.displayFen}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
