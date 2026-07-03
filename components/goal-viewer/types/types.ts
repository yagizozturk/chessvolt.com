import type { MoveGoal } from "@/features/move-sequence/types/move-goal";

type GoalsProps = {
  goals: MoveGoal[];
};

export type GoalViewerProps = GoalsProps & {
  progressValue: number;
  hintCount?: number;
  turnLabel: string;
};

export type ActiveGoalCardProps = {
  goal: MoveGoal;
  hintCount?: number;
  turnLabel: string;
};

export type GoalStepperProps = GoalsProps;
