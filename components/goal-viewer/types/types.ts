import type { MoveGoal } from "@/features/move-sequence/types/move-goal";

type GoalsProps = {
  goals: MoveGoal[];
};

export type GoalViewerProps = GoalsProps & {
  progressValue: number;
};

export type ActiveGoalCardProps = {
  goal: MoveGoal;
};

export type NextGoalRowProps = {
  goal: MoveGoal;
};

export type GoalStepperProps = GoalsProps;
