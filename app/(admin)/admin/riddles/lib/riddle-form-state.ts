export type RiddleFormState = {
  error: string | null;
};

export const initialRiddleFormState: RiddleFormState = { error: null };

export type BulkCreateFormState = RiddleFormState & {
  summary?: {
    created: number;
    failed: number;
    errors: string[];
  };
};

export type LichessImportFormState = RiddleFormState & {
  summary?: {
    imported: number;
    skippedDuplicate: number;
    skippedFilter: number;
    errors: number;
    unknownLichessThemes: string[];
  };
};
