"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import type { Riddle } from "@/features/riddle/types/riddle";

import { RiddlesList } from "./riddles-list";

type Props = {
  riddles: Riddle[];
};

export function RiddlesFilters({ riddles }: Props) {
  const [titleQuery, setTitleQuery] = useState("");

  const filteredRiddles = useMemo(() => {
    const normalizedTitle = titleQuery.trim().toLowerCase();

    return riddles.filter((riddle) => {
      const matchesTitle = !normalizedTitle || riddle.title.toLowerCase().includes(normalizedTitle);
      return matchesTitle;
    });
  }, [riddles, titleQuery]);

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 space-y-3 rounded-lg p-4">
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
