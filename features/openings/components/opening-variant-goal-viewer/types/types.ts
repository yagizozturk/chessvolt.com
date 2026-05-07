import type { MoveGoal } from "../../../types/opening-variant";

type GoalsProps = {
  goals: MoveGoal[];
};

export type OpeningVariantGoalViewerProps = GoalsProps;

export type ActiveGoalCardProps = {
  goal: MoveGoal;
};

export type NextGoalRowProps = {
  goal: MoveGoal;
};

export type GoalStepperProps = GoalsProps;
