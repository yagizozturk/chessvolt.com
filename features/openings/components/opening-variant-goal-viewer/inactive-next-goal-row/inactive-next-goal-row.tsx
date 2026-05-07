import type { NextGoalRowProps } from "../types/types";

export function InactiveNextGoalRow({ goal }: NextGoalRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 opacity-30 transition-opacity">
      <div className="flex min-w-0 flex-1 items-center">
        <span className="min-w-0 truncate text-sm font-medium">Next goal: {goal.title}</span>
      </div>
    </div>
  );
}
