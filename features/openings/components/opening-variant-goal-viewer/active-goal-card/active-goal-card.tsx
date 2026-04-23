import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { GoalDescription } from "../goal-description/goal-description";
import type { ActiveGoalCardProps } from "../types/types";

export function ActiveGoalCard({ goal }: ActiveGoalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-2">{goal.title}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-sm leading-relaxed">
            <GoalDescription description={goal.description} />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
