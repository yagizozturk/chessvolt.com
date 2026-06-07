import { LichessRiddleImporterForm } from "./lichess-riddle-importer-form";

type Props = {
  searchParams: Promise<{
    error?: string;
    imported?: string;
    skippedDuplicate?: string;
    skippedFilter?: string;
    errors?: string;
    unknownThemes?: string;
    errorDetails?: string;
  }>;
};

export default async function AdminLichessRiddleImporterPage({ searchParams }: Props) {
  const params = await searchParams;

  let unknownThemes: string[] = [];
  if (params.unknownThemes) {
    try {
      const parsed = JSON.parse(params.unknownThemes) as unknown;
      if (Array.isArray(parsed)) {
        unknownThemes = parsed.filter((v): v is string => typeof v === "string");
      }
    } catch {
      unknownThemes = [];
    }
  }

  let errorDetails: { puzzleId: string; message: string }[] = [];
  if (params.errorDetails) {
    try {
      const parsed = JSON.parse(params.errorDetails) as unknown;
      if (Array.isArray(parsed)) {
        errorDetails = parsed.filter(
          (item): item is { puzzleId: string; message: string } =>
            typeof item === "object" &&
            item !== null &&
            "puzzleId" in item &&
            "message" in item &&
            typeof (item as { puzzleId: unknown }).puzzleId === "string" &&
            typeof (item as { message: unknown }).message === "string",
        );
      }
    } catch {
      errorDetails = [];
    }
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Lichess Riddle Importer</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Upload a Lichess puzzle CSV to import riddles, themes, and move sequences.
        </p>
      </div>

      {params.error === "missing_csv" ? (
        <p className="text-destructive text-sm">CSV content is required.</p>
      ) : null}

      {params.imported ? (
        <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
          Imported {params.imported} riddles. Skipped duplicates: {params.skippedDuplicate ?? 0}. Skipped by
          filter: {params.skippedFilter ?? 0}. Errors: {params.errors ?? 0}.
        </p>
      ) : null}

      {unknownThemes.length > 0 ? (
        <div className="bg-muted/50 rounded-md border p-3 text-xs">
          <p className="mb-2 font-medium">Unknown Lichess theme tags</p>
          <p>{unknownThemes.join(", ")}</p>
        </div>
      ) : null}

      {errorDetails.length > 0 ? (
        <div className="bg-muted/50 space-y-1 rounded-md border p-3">
          {errorDetails.map((item) => (
            <p key={`${item.puzzleId}-${item.message}`} className="text-xs">
              {item.puzzleId}: {item.message}
            </p>
          ))}
        </div>
      ) : null}

      <LichessRiddleImporterForm />
    </div>
  );
}
