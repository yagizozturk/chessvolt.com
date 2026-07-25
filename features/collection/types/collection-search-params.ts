export type CollectionFilterSearchParams = {
  q?: string;
  difficulty?: string;
  theme?: string;
  page?: string;
};

export type CollectionPageSearchParams = Promise<CollectionFilterSearchParams>;
