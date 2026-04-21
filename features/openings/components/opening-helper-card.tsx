import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import type { MoveGoal } from "../types/opening-variant";
import { OpeningVariantGoalViewer } from "./opening-variant-goal-viewer";

type OpeningHelperCardProps = {
  title: string | null;
  nextGoal: MoveGoal | null;
};

export function OpeningHelperCard({ title, nextGoal }: OpeningHelperCardProps) {
  return (
    <div className="space-y-4">
      <Card className="flex h-full flex-col border-0 shadow-none">
        <CardHeader>
          <CardTitle>{title ?? "Untitled variant"}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <OpeningVariantGoalViewer nextGoal={nextGoal} />
        </CardContent>
        <CardFooter className="w-full">
          <div className="flex w-full flex-col gap-2">
            <Progress value={10} className="h-2" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
