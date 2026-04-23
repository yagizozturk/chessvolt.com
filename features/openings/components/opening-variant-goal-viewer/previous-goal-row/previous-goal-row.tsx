import { CompletionBadge } from "../completion-badge/completion-badge";
import type { PreviousGoalRowProps } from "../types/types";

export function PreviousGoalRow({ goal, done }: PreviousGoalRowProps) {
  return (
    <div className="bg-muted/35 flex min-h-10 items-center justify-between gap-3 rounded-lg border px-3 py-2 opacity-30 transition-opacity">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="min-w-0 truncate text-sm font-medium">Previous goal: {goal.title}</span>
      </div>
      {done && <CompletionBadge size="sm" />}
    </div>
  );
}
