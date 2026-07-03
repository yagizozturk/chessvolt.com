export type MoveGoal = {
  ply: number;
  move: string;
  card?: string;
  title: string;
  initialHint: string;
  secondaryHint: string;
  successMessage: string;
  isCompleted: boolean;
  imageSrc?: string;
  imageAlt?: string;
};
