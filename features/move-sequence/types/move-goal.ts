// TODO: Refactor
import type { MoveVisual } from "./move-visual";

export type MoveGoal = {
  ply: number;
  move: string;
  title: string;
  visuals: string | MoveVisual | MoveVisual[];
  strategy: string;
  checkpointMessage: string;
  isCompleted: boolean;
};

export type MoveGoals = {
  mainIdea: string;
  lessonsLearned: string;
  plys: MoveGoal[];
};
