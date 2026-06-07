import type { ContentThemeWeight } from "@/features/content-theme/types/content-theme-weight";

export type LichessThemeMapEntry = {
  slug: string;
  name: string;
  category: string;
};

export type LichessMetadataTag = {
  type: "length" | "mate_length" | "origin" | "goal";
  value: string | number;
};

export type LichessThemeMap = {
  ignoredForContentThemes: string[];
  metadataTags: Record<string, LichessMetadataTag>;
  themeMap: Record<string, LichessThemeMapEntry>;
  weightRules: {
    defaultByOrder: number[];
    ignoreTagsBeforeWeighting: boolean;
    phaseWeightCap: number;
    genericMateWeightCap: number;
    specificMatePatternWeightBonus: number;
  };
};

export type ResolvedContentTheme = {
  slug: string;
  name: string;
  category: string;
  weight: ContentThemeWeight;
};

export type ResolvedLichessThemes = {
  contentThemes: ResolvedContentTheme[];
  themeSlugs: string[];
  metadata: Record<string, string | number>;
  unknownTags: string[];
};

export type LichessCsvRow = {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  ratingDeviation: number;
  popularity: number;
  themes: string;
  openingTags: string;
};

export type LichessImportRowResult =
  | { status: "imported"; puzzleId: string; riddleId: string }
  | { status: "skipped_duplicate"; puzzleId: string }
  | { status: "skipped_filter"; puzzleId: string; reason: string }
  | { status: "error"; puzzleId: string; message: string };

export type LichessImportSummary = {
  imported: number;
  skippedDuplicate: number;
  skippedFilter: number;
  errors: number;
  unknownLichessThemes: string[];
  rowResults: LichessImportRowResult[];
};
