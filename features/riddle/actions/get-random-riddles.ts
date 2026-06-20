"use server";

import type { RiddlesListFilters } from "@/features/riddle/constants/riddles-list.constants";
import { getRandomRiddlesForDisplay, type RiddleListItem } from "@/features/riddle/services/riddle-list.service";
import { getPublicUser } from "@/lib/supabase/auth";

export async function getRandomRiddlesAction(filters: RiddlesListFilters): Promise<RiddleListItem[]> {
  const { supabase } = await getPublicUser();
  return getRandomRiddlesForDisplay(supabase, filters);
}
