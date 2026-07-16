import type { VoltBoardMode } from "@/components/boards/volt-board/volt-board";
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";

type GoalsProps = {
  goals: MoveGoal[];
};

export type GoalViewerProps = GoalsProps & {
  progressValue: number;
  mode?: VoltBoardMode;
  turnLabel: string;
  mainStrategy?: string;
  isFirstPly?: boolean;
};

export type ActiveGoalCardProps = {
  goal: MoveGoal;
  mode?: VoltBoardMode;
  turnLabel: string;
  mainStrategy?: string;
  isFirstPly?: boolean;
};

export type GoalStepperProps = GoalsProps;
