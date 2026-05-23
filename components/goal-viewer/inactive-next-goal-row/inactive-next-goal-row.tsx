import type { NextGoalRowProps } from "../types/types";

export function InactiveNextGoalRow({ goal }: NextGoalRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2">
      <span className="text-muted-foreground min-w-0 truncate text-sm font-medium">Next goal: {goal.title}</span>
    </div>
  );
}
