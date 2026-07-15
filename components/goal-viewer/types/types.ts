import type { MoveGoal } from "@/features/move-sequence/types/move-goal";

type GoalsProps = {
  goals: MoveGoal[];
};

export type GoalViewerProps = GoalsProps & {
  progressValue: number;
  hintCount?: number;
  turnLabel: string;
  strategy: string;
  lessonsLearned: string;
  isAllGoalsCompleted: boolean;
};

export type ActiveGoalCardProps = {
  goal: MoveGoal;
  hintCount?: number;
  turnLabel: string;
};

export type ActiveIdeaCardProps = {
  idea: string;
  ttsKey: string | number;
  title?: string;
};

export type GoalStepperProps = GoalsProps;
