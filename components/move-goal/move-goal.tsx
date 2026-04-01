"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MoveGoal as MoveGoalData } from "@/features/openings/types/opening-variant";
import { cn } from "@/lib/utils/cn";
import { Check, Goal } from "lucide-react";

export type MoveGoalProps = {
  goal: MoveGoalData;
  index: number;
  highlighted: boolean;
  done: boolean;
};

export function MoveGoal({ goal, index, highlighted, done }: MoveGoalProps) {
  if (highlighted) {
    return (
      <Card className="border-primary/35 ring-primary/15 gap-2 shadow-md ring-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
              <Goal className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <CardTitle className="flex flex-wrap items-center gap-x-2 text-lg">
                <span className="min-w-0">{goal.title}</span>
                {done ? (
                  <span
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm dark:bg-emerald-500"
                    aria-label="Goal completed"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.75} aria-hidden />
                  </span>
                ) : null}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-0 pt-0">
          <div className="flex gap-3">
            <div className={cn("min-w-0 space-y-1.5", done && "opacity-80")}>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {goal.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "bg-muted/35 flex min-h-10 items-center justify-between gap-2 rounded-lg border px-3 py-2",
        !done && "opacity-35",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="bg-muted text-muted-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
          <Goal className="h-3.5 w-3.5" aria-hidden />
        </div>
        <span className="min-w-0 truncate text-sm font-medium">
          Goal {index + 1}: {goal.title}
        </span>
      </div>
      {done ? (
        <span
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500"
          aria-label="Goal completed"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.75} aria-hidden />
        </span>
      ) : null}
    </div>
  );
}
