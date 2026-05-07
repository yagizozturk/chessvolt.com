import Lottie from "lottie-react";

import completeAnimationData from "@/public/images/animations/animation-complete.json";

import type { GoalStepperProps } from "../types/types";

export function GoalStepper({ goals }: GoalStepperProps) {
  const activeGoalIndex = goals.findIndex((goal) => !goal.isCompleted);

  return (
    <div className="flex items-center gap-2">
      {goals.map((goal, index) =>
        goal.isCompleted ? (
          <div
            key={`${goal.ply}-${goal.move}-${index}-goal-progress`}
            className="bg-muted relative size-8 overflow-hidden rounded-full"
            aria-label={`Goal ${index + 1} completed`}
          >
            <Lottie
              animationData={completeAnimationData}
              loop={false}
              autoplay={true}
              className="absolute inset-0 size-full scale-[1.90]"
            />
          </div>
        ) : (
          <div
            key={`${goal.ply}-${goal.move}-${index}-goal-progress`}
            className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
              activeGoalIndex === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            aria-label={`Goal ${index + 1}`}
          >
            {index + 1}
          </div>
        ),
      )}
    </div>
  );
}
