"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

import type { BoardHistory } from "@/components/boards/volt-board-utilities/use-board-history";
import { Button } from "@/components/ui/button";

type BoardHistoryControlsProps = {
  history: BoardHistory;
};

export function BoardHistoryControls({ history }: BoardHistoryControlsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button variant="voltIcon" onClick={history.prev} disabled={!history.canPrev} aria-label="Previous move">
        <ChevronLeft className="size-5" />
      </Button>
      <Button variant="voltIcon" onClick={history.next} disabled={!history.canNext} aria-label="Next move">
        <ChevronRight className="size-5" />
      </Button>
      {history.isBrowsing ? (
        <Button variant="voltIcon" onClick={history.reset} aria-label="Back to current position">
          <RotateCcw className="size-5" />
        </Button>
      ) : null}
    </div>
  );
}
