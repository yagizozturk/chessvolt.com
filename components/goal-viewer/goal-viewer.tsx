import { MainIdeaCard } from "@/components/main-idea-card/main-idea-card";

import { ActiveGoalCard } from "./active-goal-card/active-goal-card";
import { GoalStepper } from "./goal-stepper/goal-stepper";
import type { GoalViewerProps } from "./types/types";

export function GoalViewer({
  goals,
  mode = "practice",
  turnLabel,
  mainIdea = "",
  showMainIdea = false,
}: GoalViewerProps) {
  if (!goals.length) return null;

  const activeGoal = goals.find((goal) => !goal.isCompleted) ?? goals.at(-1)!; // goals.at means the last complete one if all of them is complete
  if (!activeGoal) return null;

  const trimmedMainIdea = mainIdea.trim();
  const showingMainIdea = showMainIdea && trimmedMainIdea.length > 0;

  return (
    <div>
      {showingMainIdea ? (
        <div className="card-border-bottom-shadow mb-3">
          <MainIdeaCard mainIdea={trimmedMainIdea} />
        </div>
      ) : null}
      <div className="card-border-bottom-shadow mb-3 p-4">
        <ActiveGoalCard goal={activeGoal} mode={mode} turnLabel={turnLabel} />
      </div>
      <GoalStepper goals={goals} mode={mode} />
    </div>
  );
}
