import Image from "next/image";

import { MoveGoal } from "../types/opening-variant";

type OpeningVariantGoalViewerProps = {
  nextGoal: MoveGoal | null;
};

export function OpeningVariantGoalViewer({ nextGoal }: OpeningVariantGoalViewerProps) {
  if (!nextGoal) return null;

  return (
    <div className="flex items-start gap-3">
      <div>
        <Image src="/images/icons/icon-goal.png" alt="Volt icon" width={48} height={48} className="mt-3 shrink-0" />
      </div>
      <div>
        <p className="text-card-foreground text-lg font-semibold">{nextGoal.title}</p>
        <p className="text-muted-foreground">{nextGoal.description}</p>
      </div>
    </div>
  );
}
