import type { GenerateGoalsInput } from "@/lib/move-sequence-goals/types";

export type GenerateOpeningVariantGoalsInput = GenerateGoalsInput & {
  initialPly: number;
};

export type OpeningVariantGoalsResult = {
  title: string;
  description: string;
  goals: import("@/features/move-sequence/types/move-goal").MoveGoal[];
};
