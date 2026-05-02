import type { MoveGoal } from "../../../types/opening-variant";

export type OpeningVariantGoalViewerProps = {
  goals: MoveGoal[];
};

export type ActiveGoalCardProps = {
  goal: MoveGoal;
};

export type NextGoalRowProps = {
  goal: MoveGoal;
  done: boolean;
};

export type PreviousGoalRowProps = {
  goal: MoveGoal;
  done: boolean;
};
