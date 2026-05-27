"use client";

import { useMemo, useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import type { Riddle } from "@/features/riddle/types/riddle";
import { GAME_TYPE_DETAILS } from "@/lib/shared/constants/game-type-details";

import { ALL_GAME_TYPES_VALUE } from "../constants/riddles-filters.constants";
import { RiddlesList } from "./riddles-list";

type Props = {
  riddles: Riddle[];
};

// ============================================================================
// Filters
// Riddle list filter component.
// Combines static game type options with existing riddle values,
// then filters by selected game type and title query.
// ============================================================================
export function RiddlesFilters({ riddles }: Props) {
  const [selectedGameType, setSelectedGameType] = useState(ALL_GAME_TYPES_VALUE);
  const [titleQuery, setTitleQuery] = useState("");

  // Static game type options + game types already present in riddles.
  const gameTypeOptions = useMemo(() => {
    const fromStatic = Object.keys(GAME_TYPE_DETAILS);
    const fromRiddles = riddles.map((riddle) => riddle.gameType?.trim() ?? "").filter(Boolean);

    return Array.from(new Set([...fromStatic, ...fromRiddles])).sort((a, b) => a.localeCompare(b));
  }, [riddles]);

  // Final filtered list by selected game type and title query.
  const filteredRiddles = useMemo(() => {
    const normalizedTitle = titleQuery.trim().toLowerCase();

    return riddles.filter((riddle) => {
      const matchesGameType =
        selectedGameType === ALL_GAME_TYPES_VALUE ||
        (riddle.gameType?.trim().toLowerCase() ?? "") === selectedGameType.toLowerCase();

      const matchesTitle = !normalizedTitle || riddle.title.toLowerCase().includes(normalizedTitle);

      return matchesGameType && matchesTitle;
    });
  }, [riddles, selectedGameType, titleQuery]);

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 space-y-3 rounded-lg p-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium">Filter by game type</p>
          <Combobox
            value={selectedGameType}
            onValueChange={(value) => setSelectedGameType(value ?? ALL_GAME_TYPES_VALUE)}
          >
            <ComboboxInput
              placeholder="Select game type..."
              aria-label="Filter riddles by game type"
              showClear
              className="w-full"
            />
            <ComboboxContent>
              <ComboboxEmpty>No game type found.</ComboboxEmpty>
              <ComboboxList>
                <ComboboxItem value={ALL_GAME_TYPES_VALUE}>All game types</ComboboxItem>
                {gameTypeOptions.map((gameType) => (
                  <ComboboxItem key={gameType} value={gameType}>
                    {gameType}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium">Search by title</p>
          <Input
            value={titleQuery}
            onChange={(e) => setTitleQuery(e.target.value)}
            placeholder="Type riddle title..."
            aria-label="Search riddles by title"
          />
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Showing {filteredRiddles.length} of {riddles.length} riddles
      </p>

      <RiddlesList riddles={filteredRiddles} />
    </div>
  );
}
