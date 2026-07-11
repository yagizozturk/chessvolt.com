// TODO: Refactor
import type { IdeaVisual } from "./idea-visual";

export type MoveGoal = {
  ply: number;
  move: string;
  title: string;
  hint: string;
  idea: string;
  ideaVisuals: IdeaVisual[];
  ideaSuccessMessage: string;
  successMessage: string;
  isCompleted: boolean;
  imageSrc?: string;
  imageAlt?: string;
};
