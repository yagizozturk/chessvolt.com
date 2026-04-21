import { Lightbulb } from "lucide-react";

import { MoveGoal } from "../types/opening-variant";

type OpeningVariantGoalViewerProps = {
  nextGoal: MoveGoal | null;
};

export function OpeningVariantGoalViewer({ nextGoal }: OpeningVariantGoalViewerProps) {
  return (
    <div className="flex items-start gap-3">
      <Lightbulb className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="text-muted-foreground text-sm">{nextGoal?.title ?? "No title available."}</p>
      <p className="text-muted-foreground text-sm">{nextGoal?.description ?? "No description available."}</p>
    </div>
  );
}
