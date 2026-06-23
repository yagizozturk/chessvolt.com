import type { SupabaseClient } from "@supabase/supabase-js";

import * as riddleThemeService from "@/features/riddle-theme/services/riddle-theme.service";
import * as riddleRepo from "@/features/riddle/repository/riddle.repository";
import { parseRiddleRating } from "@/features/riddle/types/riddle-rating";
import type { ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import type { Theme } from "@/features/theme/types/theme";

import { ensureTheme } from "./ensure-theme";
import themeMapJson from "./lichess-theme-map.json";
import { parseLichessCsv } from "./parse-csv";
import { mergeResolvedThemes, resolveEducationalThemes, resolveOpeningThemes } from "./resolve-themes";
import {
  DEFAULT_LICHESS_IMPORT_CONFIG,
  LICHESS_IMPORT_SOURCE,
  type LichessImportConfig,
  type LichessImportSummary,
  type LichessThemeMap,
} from "./types";

const themeMap = themeMapJson as LichessThemeMap;

export async function importLichessRiddlesFromCsv(
  supabase: SupabaseClient,
  csvText: string,
  config: LichessImportConfig = DEFAULT_LICHESS_IMPORT_CONFIG,
): Promise<LichessImportSummary> {
  const rows = parseLichessCsv(csvText);
  const existingSourceIds = await riddleRepo.findExistingSourceIds(
    supabase,
    LICHESS_IMPORT_SOURCE,
    rows.map((r) => r.puzzleId),
  );

  const themeCache = new Map<string, Theme>();
  const unknownSet = new Set<string>();

  let imported = 0;
  let skippedDuplicate = 0;
  let skippedFilter = 0;
  let errors = 0;
  let puzzleCounter = 0;

  const rowResults: LichessImportSummary["rowResults"] = [];

  for (const row of rows) {
    if (existingSourceIds.has(row.puzzleId)) {
      skippedDuplicate++;
      rowResults.push({ status: "skipped_duplicate", puzzleId: row.puzzleId });
      continue;
    }

    if (row.popularity < config.minPopularity) {
      skippedFilter++;
      rowResults.push({
        status: "skipped_filter",
        puzzleId: row.puzzleId,
        reason: `Popularity ${row.popularity} < ${config.minPopularity}`,
      });
      continue;
    }

    const rating = parseRiddleRating(row.rating);
    if (rating == null) {
      errors++;
      rowResults.push({
        status: "error",
        puzzleId: row.puzzleId,
        message: `Invalid rating ${row.rating}`,
      });
      continue;
    }

    try {
      const educational = resolveEducationalThemes(row.themes, themeMap);
      const openingThemes = resolveOpeningThemes(row.openingTags);
      const resolved = mergeResolvedThemes(educational, openingThemes);

      for (const tag of resolved.unknownTags) unknownSet.add(tag);

      const themeLinks: { themeId: string; weight: ThemeLinkWeight }[] = [];

      for (const item of resolved.contentThemes) {
        const theme = await ensureTheme(supabase, themeCache, {
          slug: item.slug,
          name: item.name,
          category: item.category,
        });

        if (!theme) throw new Error(`Could not ensure theme ${item.slug}`);

        themeLinks.push({ themeId: theme.id, weight: item.weight });
      }

      puzzleCounter++;
      const title = `Puzzle ${puzzleCounter}`;

      const riddle = await riddleRepo.create(supabase, {
        sourceId: row.puzzleId,
        source: LICHESS_IMPORT_SOURCE,
        title,
        description: null,
        rating,
        popularity: row.popularity,
        moves: row.moves,
        initialFen: row.fen,
        displayFen: row.fen,
        pgn: null,
        goals: null,
        gameId: null,
        isActive: true,
      });

      if (!riddle) throw new Error("Could not create riddle");

      if (themeLinks.length > 0) {
        const ok = await riddleThemeService.addRiddleThemes(
          supabase,
          themeLinks.map((item) => ({
            riddleId: riddle.id,
            themeId: item.themeId,
            weight: item.weight,
          })),
        );

        if (!ok) {
          throw new Error("Could not create all riddle theme links");
        }
      }

      existingSourceIds.add(row.puzzleId);
      imported++;
      rowResults.push({ status: "imported", puzzleId: row.puzzleId, riddleId: riddle.id });
    } catch (error) {
      errors++;
      rowResults.push({
        status: "error",
        puzzleId: row.puzzleId,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    imported,
    skippedDuplicate,
    skippedFilter,
    errors,
    unknownLichessThemes: [...unknownSet].sort(),
    rowResults,
  };
}
