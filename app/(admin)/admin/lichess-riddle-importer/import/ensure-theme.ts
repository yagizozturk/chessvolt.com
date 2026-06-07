import * as themeRepo from "@/features/theme/repository/theme.repository";
import type { Theme } from "@/features/theme/types/theme";
import { isThemeCategory } from "@/features/theme/types/theme-category";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function ensureTheme(
  supabase: SupabaseClient,
  cache: Map<string, Theme>,
  input: { slug: string; name: string; category: string },
): Promise<Theme | null> {
  const cached = cache.get(input.slug);
  if (cached) return cached;

  const existing = await themeRepo.findBySlug(supabase, input.slug);
  if (existing) {
    cache.set(input.slug, existing);
    return existing;
  }

  if (!isThemeCategory(input.category)) {
    console.error("ensureTheme: unknown category", input.category, "for slug", input.slug);
    return null;
  }

  const created = await themeRepo.create(supabase, {
    title: input.name,
    slug: input.slug,
    category: input.category,
    isActive: true,
  });

  if (created) cache.set(input.slug, created);
  return created;
}
