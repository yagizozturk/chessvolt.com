import Lottie from "lottie-react";

import { MainIdeaCard } from "@/components/main-idea-card/main-idea-card";
import { Progress } from "@/components/ui/progress";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

import { ActiveGoalCard } from "./active-goal-card/active-goal-card";
import { GoalStepper } from "./goal-stepper/goal-stepper";
import type { GoalViewerProps } from "./types/types";

export function GoalViewer({
  goals,
  progressValue,
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
      <div className="card-border-bottom-shadow mb-3">
        <ActiveGoalCard goal={activeGoal} mode={mode} turnLabel={turnLabel} />
      </div>
      <div className="mb-3 flex items-center">
        <Progress value={progressValue} className="h-4 flex-1 rounded-r-none" />
        <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
          <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
        </div>
      </div>
      <GoalStepper goals={goals} mode={mode} />
    </div>
  );
}
