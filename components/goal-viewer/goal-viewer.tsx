import Lottie from "lottie-react";

import { Progress } from "@/components/ui/progress";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

import { ActiveGoalCard } from "./active-goal-card/active-goal-card";
import { GoalStepper } from "./goal-stepper/goal-stepper";
import { InactiveNextGoalRow } from "./inactive-next-goal-row/inactive-next-goal-row";
import type { GoalViewerProps } from "./types/types";

export function GoalViewer({ goals, progressValue }: GoalViewerProps) {
  if (!goals.length) return null;

  const activeGoal = goals.find((goal) => !goal.isCompleted) ?? goals.at(-1)!; // goals.at means the last complete one if all of them is complete
  const activeGoalArrayIndex = goals.indexOf(activeGoal);
  const nextGoal = goals[activeGoalArrayIndex + 1] ?? null;
  if (!activeGoal) return null;

  return (
    <div data-tour="goals">
      <div className="mb-3 flex items-center" data-tour="progress">
        <Progress value={progressValue} className="h-4 flex-1 rounded-r-none" />
        <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
          <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
        </div>
      </div>
      <div className="bg-muted/50 border-b-card-shadow mb-3 flex flex-col rounded-xl border-b-[6px]">
        <ActiveGoalCard goal={activeGoal} />
        {nextGoal ? (
          <InactiveNextGoalRow
            key={`${nextGoal.ply}-${nextGoal.move}-${activeGoalArrayIndex + 1}-next`}
            goal={nextGoal}
          />
        ) : null}
      </div>
      <GoalStepper goals={goals} data-tour="goal-stepper-2" />
    </div>
  );
}
