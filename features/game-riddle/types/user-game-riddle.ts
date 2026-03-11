export type UserGameRiddle = {
  id: string;
  userId: string;
  gameRiddleId: string;
  isCorrect: boolean;
  userMoveSan: string | null;
  timeSpentSeconds: number | null;
  solvedAt: string;
};

export type AttemptedGameRiddle = {
  gameRiddleId: string;
  isCorrect: boolean;
};
