// TODO: Refactor
import Lottie from "lottie-react";

import { Progress } from "@/components/ui/progress";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

import { ActiveGoalCard } from "./active-goal-card/active-goal-card";
import { ActiveMainStrategy } from "./active-main-strategy/active-main-strategy";
import { GoalStepper } from "./goal-stepper/goal-stepper";
import type { GoalViewerProps } from "./types/types";

export function GoalViewer({
  goals,
  progressValue,
  mode = "practice",
  turnLabel,
  mainStrategy,
  showMainStrategy = false,
}: GoalViewerProps) {
  if (!goals.length) return null;

  const activeGoal = goals.find((goal) => !goal.isCompleted) ?? goals.at(-1)!; // goals.at means the last complete one if all of them is complete
  if (!activeGoal) return null;

  const trimmedMainStrategy = mainStrategy?.trim() ?? "";

  return (
    <>
      {showMainStrategy && trimmedMainStrategy ? (
        <div className="card-border-bottom-shadow">
          <ActiveMainStrategy
            title="Main Idea"
            message={trimmedMainStrategy}
            imageSrc="/images/avatar/main-idea-avatar.png"
            imageAlt="Main Idea"
          />
        </div>
      ) : null}
      <div data-tour="goals">
        <div className="card-border-bottom-shadow mb-3">
          <ActiveGoalCard goal={activeGoal} mode={mode} turnLabel={turnLabel} />
        </div>
        <div className="mb-3 flex items-center" data-tour="progress">
          <Progress value={progressValue} className="h-4 flex-1 rounded-r-none" />
          <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
            <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
          </div>
        </div>
        <GoalStepper goals={goals} data-tour="goal-stepper-2" />
      </div>
    </>
  );
}
