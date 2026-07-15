// TODO: Refactor
import type { IdeaVisual } from "./idea-visual";

export type MoveGoal = {
  ply: number;
  move: string;
  title: string;
  visuals: IdeaVisual[];
  strategy: string;
  checkpointMessage: string;
  isCompleted: boolean;
};

export type MoveGoals = {
  strategy: string;
  lessonsLearned: string;
  plys: MoveGoal[];
};
