import type { Riddle } from "@/features/riddle/types/riddle";

/** Riddle plus theme slugs loaded from riddle_themes (not a riddles table column). */
export type RiddleWithThemes = Riddle & {
  themeSlugs: string[];
};
