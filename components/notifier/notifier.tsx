// TODO: Refactor
"use client";

import Lottie from "lottie-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { useAchievementSound } from "@/lib/shared/hooks/sound/use-achievement-sound";
import coinAnimationData from "@/public/images/animations/animation-coin.json";

type NotifierProps = {
  goals: MoveGoal[];
};

export function Notifier({ goals }: NotifierProps) {
  if (!goals.length) return null;

  const previousCompletionByGoalRef = useRef<Map<number, boolean>>(new Map());
  const { playAchievementSound } = useAchievementSound();

  useEffect(() => {
    const nextCompletionByGoal = new Map<number, boolean>();

    goals.forEach((goal) => {
      const previousCompletionState = previousCompletionByGoalRef.current.get(goal.ply) ?? goal.isCompleted;

      if (goal.card && goal.isCompleted && !previousCompletionState) {
        playAchievementSound();

        toast("", {
          position: "bottom-right",
          description: (
            <div className="flex items-center">
              <div className="size-16 shrink-0 overflow-hidden">
                <Lottie animationData={coinAnimationData} loop={false} autoplay={true} className="size-full" />
              </div>
              <div>
                <p className="text-lg font-bold">{goal.card}</p>
              </div>
            </div>
          ),
          duration: 4000,
        });
      }

      nextCompletionByGoal.set(goal.ply, goal.isCompleted);
    });

    previousCompletionByGoalRef.current = nextCompletionByGoal;
  }, [goals]);

  return null;
}
