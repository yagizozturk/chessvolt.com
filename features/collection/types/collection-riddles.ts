import type { Collection } from "@/features/collection/types/collection";
import type { Game } from "@/features/game/types/game";
import type { PrimaryRiddleTheme } from "@/features/riddle-theme/services/riddle-theme.service";
import type { Riddle } from "@/features/riddle/types/riddle";

// ============================================================
// This type has the riddle card data in collection listing page
// ============================================================
export type CollectionRiddleCardItemData = {
  riddle: Riddle;
  game: Game | null;
  href: string;
  displayFen: string | null;
  accuracyPercent: number | null;
  primaryTheme: PrimaryRiddleTheme | null;
};

// ============================================================
// This type is the final type that page renders including card
// item data and pagiantion
// ============================================================
export type CollectionRiddlesPageData = {
  collection: Collection;
  collectionRiddles: CollectionRiddleCardItemData[];
  pagination?: {
    page: number;
    pageSize: number;
    totalRiddleCount: number;
    totalPages: number;
  };
};
