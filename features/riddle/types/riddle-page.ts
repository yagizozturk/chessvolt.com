import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { StandaloneRiddleSource } from "@/features/riddle/utilities/build-riddle-path";

export type LoadCollectionRiddlePageInput = {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  riddleId: string;
};

export type LoadStandaloneRiddlePageInput = {
  supabase: SupabaseClient;
  user: User | null;
  riddleId: string;
  from?: StandaloneRiddleSource;
};
