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

// TODO: _ case lerini düzelt
export type OpeningIdeas = {
  objective: string;
  core_idea: string;
  common_mistake: string;
};

export type OpeningVariant = {
  id: string;
  openingId: string;
  sortKey: number;
  group: string;
  title: string | null;
  description: string | null;
  ply: number;
  moves: string;
  pgn: string;
  initialFen: string;
  displayFen: string | null;
  goals: MoveGoal[] | null;
  ideas: OpeningIdeas | null;
  createdAt: string;
};
