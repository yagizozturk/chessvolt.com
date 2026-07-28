"use client";

import type { FavoritesView } from "@/features/favorites/types/favorites-view";
import { useFavoritesTour } from "@/features/user-favorites/hooks/use-favorites-tour";

type FavoritesTourProps = {
  view: FavoritesView;
};

export function FavoritesTour({ view }: FavoritesTourProps) {
  const { Tour } = useFavoritesTour({ view });
  return Tour;
}
