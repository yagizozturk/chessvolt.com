import type { NextGoalRowProps } from "../types/types";

// TODO: border-b-[6px] border-b-[#111] refactor
export function InactiveNextGoalRow({ goal }: NextGoalRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border-b-[6px] border-b-[#111] px-3 py-2 opacity-30 transition-opacity">
      <span className="min-w-0 truncate text-sm font-medium">Next goal: {goal.title}</span>
    </div>
  );
}
