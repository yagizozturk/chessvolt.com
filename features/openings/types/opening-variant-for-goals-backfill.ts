import type { MoveSequenceForGoalsBackfill } from "@/features/move-sequence/types/move-sequence-for-goals-backfill";

export type OpeningVariantForGoalsBackfill = {
  variantId: string;
  initialPly: number;
  moveSequence: MoveSequenceForGoalsBackfill;
};
