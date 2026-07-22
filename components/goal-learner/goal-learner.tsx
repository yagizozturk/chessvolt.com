"use client";

import Lottie from "lottie-react";

import { ActiveGoalCard } from "@/components/goal-viewer/active-goal-card/active-goal-card";
import { cn } from "@/lib/utils";
import completeAnimationData from "@/public/images/animations/animation-complete.json";
import checkpointAnimationData from "@/public/images/animations/animation-target-blue.json";

import type { GoalLearnerProps } from "./types";

const INDEX_ITEM_CLASS = "size-8 shrink-0";

export function GoalLearner({ goals, turnLabel, mainStrategy, isFirstPly = false }: GoalLearnerProps) {
  if (!goals.length) return null;

  const activeGoalIndex = goals.findIndex((goal) => !goal.isCompleted);
  const focusIndex = activeGoalIndex >= 0 ? activeGoalIndex : Math.max(0, goals.length - 1);

  return (
    <div data-tour="goal-learner" role="list" aria-label="Goal progress" className="flex flex-col gap-3">
      {goals.map((goal, index) => {
        const isActive = index === focusIndex;

        if (isActive) {
          return (
            <div key={goal.ply} role="listitem" aria-current="step" className="card-border-bottom-shadow">
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

        const takeaway = goal.takeaway.trim();

        return (
          <div key={goal.ply} role="listitem" className="card-border-bottom-shadow flex-row items-start gap-3 p-3">
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
