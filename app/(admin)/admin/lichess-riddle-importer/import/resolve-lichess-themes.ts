import {
  clampContentThemeWeight,
  type ContentThemeWeight,
} from "@/features/content-theme/types/content-theme-weight";

import type {
  LichessThemeMap,
  ResolvedContentTheme,
  ResolvedLichessThemes,
} from "./lichess-import.types";
import { lichessOpeningTagToSlug, slugToTitle } from "./lichess-slug";

function splitTags(raw: string): string[] {
  return raw
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function weightByOrder(index: number, rules: LichessThemeMap["weightRules"]): number {
  return rules.defaultByOrder[index] ?? rules.defaultByOrder.at(-1) ?? 1;
}

function applyWeightCaps(
  item: { slug: string; category: string; weight: number },
  rules: LichessThemeMap["weightRules"],
): ContentThemeWeight {
  let weight = item.weight;

  if (item.category === "phase") {
    weight = Math.min(weight, rules.phaseWeightCap);
  }

  const isGenericMate = item.slug === "checkmate";
  const isSpecificMatePattern = item.category === "mate_patterns" && !isGenericMate;

  if (isGenericMate) {
    weight = Math.min(weight, rules.genericMateWeightCap);
  }

  if (isSpecificMatePattern) {
    weight = Math.min(10, weight + rules.specificMatePatternWeightBonus);
  }

  return clampContentThemeWeight(weight);
}

export function resolveEducationalThemes(
  themesRaw: string,
  map: LichessThemeMap,
): ResolvedLichessThemes {
  const tags = splitTags(themesRaw);
  const ignored = new Set(map.ignoredForContentThemes);
  const metadata: Record<string, string | number> = {};
  const unknownTags: string[] = [];

  const educational: Array<{
    slug: string;
    name: string;
    category: string;
    sourceOrder: number;
  }> = [];

  tags.forEach((tag, sourceOrder) => {
    if (ignored.has(tag)) return;

    const metadataDef = map.metadataTags[tag];
    if (metadataDef) {
      metadata[metadataDef.type] = metadataDef.value;
      return;
    }

    const mapped = map.themeMap[tag];
    if (!mapped) {
      unknownTags.push(tag);
      return;
    }

    educational.push({
      slug: mapped.slug,
      name: mapped.name,
      category: mapped.category,
      sourceOrder,
    });
  });

  const contentThemes: ResolvedContentTheme[] = educational.map((item, index) => ({
    slug: item.slug,
    name: item.name,
    category: item.category,
    weight: applyWeightCaps(
      { slug: item.slug, category: item.category, weight: weightByOrder(index, map.weightRules) },
      map.weightRules,
    ),
  }));

  return {
    contentThemes,
    themeSlugs: contentThemes.map((t) => t.slug),
    metadata,
    unknownTags,
  };
}

export function resolveOpeningThemes(openingTagsRaw: string): ResolvedContentTheme[] {
  const tags = splitTags(openingTagsRaw);
  if (tags.length === 0) return [];

  const defaultByOrder = [10, 8, 7, 6, 5];

  return tags.map((tag, index) => {
    const slug = lichessOpeningTagToSlug(tag);
    return {
      slug,
      name: slugToTitle(slug),
      category: "opening",
      weight: clampContentThemeWeight(defaultByOrder[index] ?? 1),
    };
  });
}

export function mergeResolvedThemes(
  educational: ResolvedLichessThemes,
  openingThemes: ResolvedContentTheme[],
): {
  contentThemes: ResolvedContentTheme[];
  themeSlugs: string[];
  metadata: Record<string, string | number>;
  unknownTags: string[];
} {
  const bySlug = new Map<string, ResolvedContentTheme>();

  for (const theme of educational.contentThemes) bySlug.set(theme.slug, theme);
  for (const theme of openingThemes) {
    if (!bySlug.has(theme.slug)) bySlug.set(theme.slug, theme);
  }

  const contentThemes = [...bySlug.values()];

  return {
    contentThemes,
    themeSlugs: contentThemes.map((t) => t.slug),
    metadata: educational.metadata,
    unknownTags: educational.unknownTags,
  };
}
