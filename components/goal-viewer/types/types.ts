import type { VoltBoardMode } from "@/components/boards/volt-board/volt-board";
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import type { PuzzlePrimaryTheme } from "@/features/puzzle-theme/types/puzzle-theme";

type GoalsProps = {
  goals: MoveGoal[];
};

export type GoalViewerProps = GoalsProps & {
  progressValue: number;
  mode?: VoltBoardMode;
  turnLabel: string;
  mainIdea?: string;
  showMainIdea?: boolean;
  theme?: PuzzlePrimaryTheme | null;
};

export type ActiveGoalCardProps = {
  goal: MoveGoal;
  mode?: VoltBoardMode;
  turnLabel: string;
};

export type GoalStepperProps = GoalsProps & {
  mode?: VoltBoardMode;
};
