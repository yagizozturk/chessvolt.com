import { ActiveGoalCard } from "./active-goal-card/active-goal-card";
import { GoalStepper } from "./goal-stepper/goal-stepper";
import { InactiveNextGoalRow } from "./inactive-next-goal-row/inactive-next-goal-row";
import type { OpeningVariantGoalViewerProps } from "./types/types";

export function OpeningVariantGoalViewer({ goals }: OpeningVariantGoalViewerProps) {
  if (!goals.length) return null;

  const activeGoal = goals.find((goal) => !goal.isCompleted) ?? goals.at(-1)!; // goals.at means the last complete one if all of them is complete
  const activeGoalArrayIndex = goals.indexOf(activeGoal);
  const nextGoal = goals[activeGoalArrayIndex + 1] ?? null;
  if (!activeGoal) return null;

  return (
    <>
      <div className="bg-card flex flex-col gap-3 rounded-xl">
        <ActiveGoalCard goal={activeGoal} />
        {nextGoal ? (
          <InactiveNextGoalRow
            key={`${nextGoal.ply}-${nextGoal.move}-${activeGoalArrayIndex + 1}-next`}
            goal={nextGoal}
          />
        ) : null}
      </div>
      <GoalStepper goals={goals} />
    </>
  );
}
