"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import type { MoveGoal } from "@/features/openings/types/opening-variant";
import { useAchievementSound } from "@/lib/shared/hooks/sound/use-achievement-sound";

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
        const cardImageSrc = `/images/cards/${encodeURI(goal.card).replace(" ", "-")}.png`;
        playAchievementSound();

        toast("", {
          position: "bottom-right",
          description: (
            <div className="flex items-center gap-2">
              <div className="size-14 overflow-hidden rounded-md">
                <img src={cardImageSrc} alt={goal.card} className="size-full object-cover" />
              </div>
              <div>
                <p className="text-lg font-bold">New Card Unlocked</p>
                <p className="text-muted-foreground text-base font-semibold"> {goal.card}</p>
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
