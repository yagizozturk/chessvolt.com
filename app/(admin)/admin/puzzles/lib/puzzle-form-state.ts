export type PuzzleFormState = {
  error: string | null;
};

export const initialPuzzleFormState: PuzzleFormState = { error: null };

export type BulkCreateFormState = PuzzleFormState & {
  summary?: {
    created: number;
    failed: number;
    errors: string[];
  };
};

export type LichessImportFormState = PuzzleFormState & {
  summary?: {
    imported: number;
    skippedDuplicate: number;
    skippedFilter: number;
    errors: number;
    unknownLichessThemes: string[];
  };
};
