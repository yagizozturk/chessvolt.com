import type { SupabaseClient } from "@supabase/supabase-js";

import * as openingVariantThemeRepo from "@/features/opening-variant-theme/repository/opening-variant-theme.repository";
import * as riddleThemeRepo from "@/features/riddle-theme/repository/riddle-theme.repository";
import * as studyThemeRepo from "@/features/study-theme/repository/study-theme.repository";
import type { AdminThemeLink } from "@/features/theme-link/types/admin-theme-link";
import type { ThemeLinkKind } from "@/features/theme-link/types/theme-link-kind";
import type { ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";

function toAdminThemeLink(
  kind: ThemeLinkKind,
  parentId: string,
  item: {
    id: string;
    themeId: string;
    theme: AdminThemeLink["theme"];
    weight: ThemeLinkWeight;
    createdAt: string;
  },
): AdminThemeLink {
  return {
    kind,
    id: item.id,
    parentId,
    themeId: item.themeId,
    theme: item.theme,
    weight: item.weight,
    createdAt: item.createdAt,
  };
}

export async function getAllAdminThemeLinks(supabase: SupabaseClient): Promise<AdminThemeLink[]> {
  const [riddleThemes, studyThemes, openingVariantThemes] = await Promise.all([
    riddleThemeRepo.findAllWithTheme(supabase),
    studyThemeRepo.findAllWithTheme(supabase),
    openingVariantThemeRepo.findAllWithTheme(supabase),
  ]);

  const links: AdminThemeLink[] = [
    ...riddleThemes.map((item) => toAdminThemeLink("riddle", item.riddleId, item)),
    ...studyThemes.map((item) => toAdminThemeLink("study", item.studyId, item)),
    ...openingVariantThemes.map((item) => toAdminThemeLink("opening_variant", item.openingVariantId, item)),
  ];

  return links.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAdminThemeLinkByKindAndId(
  supabase: SupabaseClient,
  kind: ThemeLinkKind,
  id: string,
): Promise<AdminThemeLink | null> {
  if (kind === "riddle") {
    const item = await riddleThemeRepo.findByIdWithTheme(supabase, id);
    return item ? toAdminThemeLink("riddle", item.riddleId, item) : null;
  }

  if (kind === "study") {
    const item = await studyThemeRepo.findByIdWithTheme(supabase, id);
    return item ? toAdminThemeLink("study", item.studyId, item) : null;
  }

  const item = await openingVariantThemeRepo.findByIdWithTheme(supabase, id);
  return item ? toAdminThemeLink("opening_variant", item.openingVariantId, item) : null;
}

export type CreateAdminThemeLinkInput = {
  kind: ThemeLinkKind;
  parentId: string;
  themeId: string;
  weight?: ThemeLinkWeight;
};

export async function createAdminThemeLink(
  supabase: SupabaseClient,
  input: CreateAdminThemeLinkInput,
): Promise<AdminThemeLink | null> {
  if (input.kind === "riddle") {
    const link = await riddleThemeRepo.create(supabase, {
      riddleId: input.parentId,
      themeId: input.themeId,
      weight: input.weight,
    });
    if (!link) return null;
    return getAdminThemeLinkByKindAndId(supabase, "riddle", link.id);
  }

  if (input.kind === "study") {
    const link = await studyThemeRepo.create(supabase, {
      studyId: input.parentId,
      themeId: input.themeId,
      weight: input.weight,
    });
    if (!link) return null;
    return getAdminThemeLinkByKindAndId(supabase, "study", link.id);
  }

  const link = await openingVariantThemeRepo.create(supabase, {
    openingVariantId: input.parentId,
    themeId: input.themeId,
    weight: input.weight,
  });
  if (!link) return null;
  return getAdminThemeLinkByKindAndId(supabase, "opening_variant", link.id);
}

export async function updateAdminThemeLink(
  supabase: SupabaseClient,
  kind: ThemeLinkKind,
  id: string,
  input: { weight?: ThemeLinkWeight },
): Promise<AdminThemeLink | null> {
  if (kind === "riddle") {
    const link = await riddleThemeRepo.update(supabase, id, input);
    return link ? getAdminThemeLinkByKindAndId(supabase, kind, link.id) : null;
  }

  if (kind === "study") {
    const link = await studyThemeRepo.update(supabase, id, input);
    return link ? getAdminThemeLinkByKindAndId(supabase, kind, link.id) : null;
  }

  const link = await openingVariantThemeRepo.update(supabase, id, input);
  return link ? getAdminThemeLinkByKindAndId(supabase, kind, link.id) : null;
}

export async function deleteAdminThemeLink(
  supabase: SupabaseClient,
  kind: ThemeLinkKind,
  id: string,
): Promise<boolean> {
  if (kind === "riddle") return riddleThemeRepo.remove(supabase, id);
  if (kind === "study") return studyThemeRepo.remove(supabase, id);
  return openingVariantThemeRepo.remove(supabase, id);
}
