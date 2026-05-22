import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";

export type { MoveGoal } from "@/features/move-sequence/types/move-goal";

// TODO: _ case lerini düzelt
export type OpeningIdeas = {
  core_idea: string;
  common_mistake: string;
};

export type OpeningVariant = {
  id: string;
  openingId: string;
  sortKey: number;
  group: string;
  title: string | null;
  description: string | null;
  ply: number;
  moveSequence: MoveSequence;
  ideas: OpeningIdeas | null;
  createdAt: string;
};
