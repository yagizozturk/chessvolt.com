import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Riddle } from "@/features/riddle/types/riddle";

export type RiddleLoaderPageProps = {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  riddleId: string;
};

export type StandaloneRiddleLoaderPageProps = {
  supabase: SupabaseClient;
  user: User | null;
  riddleId: string;
  from?: "favorites" | "riddles";
};

export type RiddlePageData = {
  riddle: Riddle;
  nextRiddleUrl: string | null;
  backUrl: string;
  isUserLoggedIn: boolean;
  isFavorited: boolean;
};
