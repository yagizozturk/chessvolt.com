import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Puzzle } from "@/features/puzzle/types/puzzle";

export type PuzzleLoaderPageProps = {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  puzzleId: string;
};

export type StandalonePuzzleLoaderPageProps = {
  supabase: SupabaseClient;
  user: User | null;
  puzzleId: string;
  from?: "favorites" | "puzzles";
  themeSlug?: string;
};

export type PuzzlePageData = {
  puzzle: Puzzle;
  nextPuzzleUrl: string | null;
  backUrl: string;
  isUserLoggedIn: boolean;
  isFavorited: boolean;
};
