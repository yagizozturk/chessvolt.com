"use client";

import Lottie from "lottie-react";

import { ActiveGoalCard } from "@/components/goal-viewer/active-goal-card/active-goal-card";
import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";
import completeAnimationData from "@/public/images/animations/animation-complete.json";
import checkpointAnimationData from "@/public/images/animations/animation-trophy.json";

import type { GoalLearnerProps } from "./types";

const INDEX_ITEM_CLASS = "size-8 shrink-0";

export function GoalLearner({ goals, turnLabel, mainStrategy, isFirstPly = false }: GoalLearnerProps) {
  if (!goals.length) return null;

  const activeGoalIndex = goals.findIndex((goal) => !goal.isCompleted);
  const hasVisibleGoal = goals.some((goal) => !goal.isCompleted || goal.takeaway.trim().length > 0);

  if (!hasVisibleGoal) return null;

  return (
    <div
      data-tour="goal-learner"
      role="list"
      aria-label="Goal progress"
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
    >
      {goals.map((goal, index) => {
        const takeaway = goal.takeaway.trim();
        const isActive = activeGoalIndex >= 0 && index === activeGoalIndex;

        if (goal.isCompleted && !takeaway) return null;

        if (isActive) {
          return (
            <div
              key={goal.ply}
              role="listitem"
              aria-current="step"
              className="card-border-bottom-shadow border-primary border-t-1 border-r-1 border-l-1"
            >
              <ActiveGoalCard
                goal={goal}
                mode="learn"
                turnLabel={turnLabel}
                mainStrategy={mainStrategy}
                isFirstPly={isFirstPly}
              />
            </div>
          );
        }

        return (
          <div
            key={goal.ply}
            role="listitem"
            className={cn(
              "card-border-bottom-shadow relative flex-row items-start gap-3 p-3",
              !goal.isCompleted && "opacity-30",
            )}
          >
            {goal.isCompleted && takeaway ? (
              <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} />
            ) : null}
            {goal.isCompleted ? (
              <div
                className={cn(INDEX_ITEM_CLASS, "bg-muted relative overflow-hidden rounded-full")}
                aria-label={`Goal ${index + 1} completed — ${goal.title}`}
              >
                <Lottie
                  animationData={goal.checkpointMessage.trim() ? checkpointAnimationData : completeAnimationData}
                  loop={false}
                  autoplay={true}
                  className="pointer-events-none absolute inset-0 size-full scale-[1.90]"
                />
              </div>
            ) : (
              <div
                className={cn(
                  INDEX_ITEM_CLASS,
                  "bg-muted text-muted-foreground grid place-items-center rounded-full text-xs font-bold",
                )}
                aria-label={`Goal ${index + 1}`}
              >
                {index + 1}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{goal.title}</div>
              {takeaway ? <p className="text-muted-foreground text-xs leading-relaxed">{takeaway}</p> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
