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

export type OpeningVariant = {
  id: string;
  openingId: string;
  sortKey: number;
  level: string;
  title: string | null;
  description: string | null;
  ply: number;
  moves: string;
  pgn: string;
  initialFen: string;
  displayFen: string | null;
  goals: MoveGoal[] | null;
  createdAt: string;
};
