import { ArrowLeft, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import type { MoveGoal } from "../types/opening-variant";
import { OpeningVariantGoalViewer } from "./opening-variant-goal-viewer";

type OpeningHelperCardProps = {
  title: string | null;
  nextGoal: MoveGoal | null;
  progressValue: number;
  hintCount: number;
  onHintClick: () => void;
};

export function OpeningHelperCard({
  title,
  nextGoal,
  progressValue,
  hintCount,
  onHintClick,
}: OpeningHelperCardProps) {
  return (
    <div className="flex h-full flex-col space-y-4">
      <Card className="flex h-full flex-1 flex-col border-0 shadow-none">
        <CardHeader className="pb-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <div className="flex items-center">
              <ArrowLeft className="text-muted-foreground size-4" aria-hidden="true" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2 text-center">
              <BookOpen className="text-muted-foreground size-4" aria-hidden="true" />
              <span>{title ?? "Untitled variant"}</span>
            </CardTitle>
            <div aria-hidden="true" />
          </div>
          <Separator className="mt-3" />
        </CardHeader>
        <CardContent className="flex h-full flex-1">
          <OpeningVariantGoalViewer nextGoal={nextGoal} />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full flex-col gap-2">
            <Progress value={progressValue} className="h-2" />
          </div>
          <div className="w-full">
            <Button className="w-full" variant="outline" disabled={hintCount >= 2} onClick={onHintClick}>
              Hint
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
