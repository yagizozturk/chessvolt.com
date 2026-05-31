export type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  coverImageColor: string;
  sortOrder: number;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CollectionWithRiddleCount = Collection & { riddleCount: number };
