export type OpeningArrow = {
  orig: string;
  dest: string;
  brush?: string;
  isCompleted?: boolean;
};

export type OpeningArrowGroup = {
  id: string;
  title: string;
  description: string;
  arrows: OpeningArrow[];
};

export type Opening = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  type: string | null;
  arrows: OpeningArrowGroup[] | null;
  displayFen: string;
  createdAt: string;
};
