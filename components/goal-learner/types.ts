import type { MoveGoal } from "@/features/move-sequence/types/move-goal";

export type GoalLearnerProps = {
  goals: MoveGoal[];
  turnLabel: string;
  mainStrategy?: string;
  isFirstPly?: boolean;
};
