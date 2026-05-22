import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";

export type MoveGoal = {
  ply: number;
  move: string;
  card?: string;
  title: string;
  description: string;
  isCompleted: boolean;
  imageSrc?: string;
  imageAlt?: string;
};

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
