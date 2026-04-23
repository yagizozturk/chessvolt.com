import { ActiveGoalCard } from "./active-goal-card/active-goal-card";
import { InactiveNextGoalRow } from "./inactive-next-goal-row/inactive-next-goal-row";
import { PreviousGoalRow } from "./previous-goal-row/previous-goal-row";
import type { OpeningVariantGoalViewerProps } from "./types/types";

export function OpeningVariantGoalViewer({ goals, currentGoalIndex }: OpeningVariantGoalViewerProps) {
  if (!goals.length) return null;

  const fallbackActiveGoalIndex = goals.findIndex((goal) => !goal.isCompleted);
  const activeGoalArrayIndex =
    currentGoalIndex > 0 && currentGoalIndex <= goals.length
      ? currentGoalIndex - 1
      : fallbackActiveGoalIndex >= 0
        ? fallbackActiveGoalIndex
        : goals.length - 1;

  const activeGoal = goals[activeGoalArrayIndex];
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
