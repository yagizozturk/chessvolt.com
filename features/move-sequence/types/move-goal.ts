// TODO: Refactor
export type MoveGoal = {
  ply: number;
  move: string;
  card?: string;
  title: string;
  hint: string;
  successMessage: string;
  isCompleted: boolean;
  imageSrc?: string;
  imageAlt?: string;
};
