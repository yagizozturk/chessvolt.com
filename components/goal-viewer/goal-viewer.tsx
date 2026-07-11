// TODO: Refactor
import Lottie from "lottie-react";

import { Progress } from "@/components/ui/progress";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

import { ActiveGoalCard } from "./active-goal-card/active-goal-card";
import { ActiveIdeaCard } from "./active-idea-card/active-idea-card";
import { GoalStepper } from "./goal-stepper/goal-stepper";
import type { GoalViewerProps } from "./types/types";

export function GoalViewer({ goals, progressValue, hintCount = 0, turnLabel }: GoalViewerProps) {
  if (!goals.length) return null;

  const activeGoal = goals.find((goal) => !goal.isCompleted) ?? goals.at(-1)!; // goals.at means the last complete one if all of them is complete
  if (!activeGoal) return null;

  return (
    <div data-tour="goals">
      {hintCount <= 0 && activeGoal.idea.trim() ? (
        <div className="card-border-bottom-shadow mb-3">
          <ActiveIdeaCard idea={activeGoal.idea} ttsKey={activeGoal.ply} />
        </div>
      ) : (
        <div className="card-border-bottom-shadow mb-3">
          <ActiveGoalCard goal={activeGoal} hintCount={hintCount} turnLabel={turnLabel} />
        </div>
      )}
      <div className="mb-3 flex items-center" data-tour="progress">
        <Progress value={progressValue} className="h-4 flex-1 rounded-r-none" />
        <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
          <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
        </div>
      </div>
      <GoalStepper goals={goals} data-tour="goal-stepper-2" />
    </div>
  );
}
