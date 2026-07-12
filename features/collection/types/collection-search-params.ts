export type CollectionFilterSearchParams = {
  q?: string;
  difficulty?: string;
  theme?: string;
};

export type CollectionPageSearchParams = Promise<CollectionFilterSearchParams>;
