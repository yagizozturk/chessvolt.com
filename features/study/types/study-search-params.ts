export type StudyFilterSearchParams = {
  q?: string;
  difficulty?: string;
  theme?: string;
  page?: string;
};

export type StudyPageSearchParams = Promise<StudyFilterSearchParams>;
