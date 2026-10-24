import { Star } from "lucide-react";

import { MainIdeaCard } from "@/components/main-idea-card/main-idea-card";
import { Progress } from "@/components/ui/progress";

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
  const completedCount = goals.filter((goal) => goal.isCompleted).length;
  const score = Math.round((completedCount / goals.length) * 100);

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
      <div className="card-border-bottom-shadow gap-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-bold">
            {goals.length} {goals.length === 1 ? "move" : "moves"} to solve
          </p>
          <span className="text-muted-foreground text-sm font-semibold tabular-nums">
            {completedCount} / {goals.length}
          </span>
        </div>
        <GoalStepper goals={goals} mode={mode} />
        <div className="space-y-1.5">
          <div className="text-muted-foreground flex items-center justify-between text-sm font-medium">
            <span>Puzzle score</span>
            <span className="tabular-nums">{score} / 100</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={score} className="h-3" />
            <Star className="size-5 shrink-0 fill-yellow-400 text-yellow-500" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
