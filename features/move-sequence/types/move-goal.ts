export type MoveGoal = {
  ply: number;
  move: string;
  card?: string;
  title: string;
  description: string;
  isCompleted: boolean;
  imageSrc?: string;
  imageAlt?: string;
};
