import type { Collection } from "@/features/collection/types/collection";
import type { Game } from "@/features/game/types/game";
import type { PrimaryRiddleTheme } from "@/features/riddle-theme/services/riddle-theme.service";
import type { Riddle } from "@/features/riddle/types/riddle";

export type CollectionRiddleDisplayItem = {
  riddle: Riddle;
  game: Game | null;
  href: string;
  displayFen: string | null;
  accuracyPercent: number | null;
  primaryTheme: PrimaryRiddleTheme | null;
};

export type CollectionRiddlesDisplayData = {
  collection: Collection;
  items: CollectionRiddleDisplayItem[];
  pagination?: {
    page: number;
    pageSize: number;
    totalRiddleCount: number;
    totalPages: number;
  };
};
