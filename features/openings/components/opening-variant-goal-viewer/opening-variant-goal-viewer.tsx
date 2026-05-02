import { ActiveGoalCard } from "./active-goal-card/active-goal-card";
import { InactiveNextGoalRow } from "./inactive-next-goal-row/inactive-next-goal-row";
import { PreviousGoalRow } from "./previous-goal-row/previous-goal-row";
import type { OpeningVariantGoalViewerProps } from "./types/types";

export function OpeningVariantGoalViewer({ goals }: OpeningVariantGoalViewerProps) {
  if (!goals.length) return null;

  const activeGoal = goals.find((goal) => !goal.isCompleted) ?? goals.at(-1)!; // goals.at means the last complete one if all of them is complete
  const activeGoalArrayIndex = goals.indexOf(activeGoal);
  const previousGoal = goals[activeGoalArrayIndex - 1] ?? null;
  const previousCompletedGoal = previousGoal?.isCompleted ? previousGoal : null;
  const nextGoal = goals[activeGoalArrayIndex + 1] ?? null;
  if (!activeGoal) return null;

  return (
    <div className="flex w-full flex-col gap-3">
      {previousCompletedGoal ? (
        <PreviousGoalRow
          key={`${previousCompletedGoal.ply}-${previousCompletedGoal.move}-${activeGoalArrayIndex - 1}-previous`}
          goal={previousCompletedGoal}
          done={previousCompletedGoal.isCompleted}
        />
      ) : null}
      <ActiveGoalCard key={`${activeGoal.ply}-${activeGoal.move}-${activeGoalArrayIndex}-active`} goal={activeGoal} />
      {nextGoal ? (
        <InactiveNextGoalRow
          key={`${nextGoal.ply}-${nextGoal.move}-${activeGoalArrayIndex + 1}-next`}
          goal={nextGoal}
          done={nextGoal.isCompleted}
        />
      ) : null}
    </div>
  );
}
