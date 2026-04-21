import Image from "next/image";

import { MoveGoal } from "../types/opening-variant";

type OpeningVariantGoalViewerProps = {
  nextGoal: MoveGoal | null;
};

export function OpeningVariantGoalViewer({ nextGoal }: OpeningVariantGoalViewerProps) {
  return (
    <div className="flex items-start gap-3">
      <div>
        <Image src="/images/icons/icon-goal.png" alt="Volt icon" width={48} height={48} className="mt-0.5 shrink-0" />
      </div>
      <div>
        <p className="text-muted-foreground text-lg font-semibold">{nextGoal?.title ?? "No title available."}</p>
        <p className="text-muted-foreground">{nextGoal?.description ?? "No description available."}</p>
      </div>
    </div>
  );
}
