"use client";

import { useMemo, useState } from "react";
import { FileJson, Upload } from "lucide-react";

import { GOALS_JSON_EXAMPLE, VALID_PGN_EXAMPLE } from "@/app/(admin)/admin/constants/riddle-examples";
import { bulkCreateRiddlesFormAction } from "@/app/(admin)/admin/riddles/actions/actions";
import { extractFenFromPgn } from "@/app/(admin)/admin/utils/extract-fen-from-pgn";
import { JsonViewer } from "@/components/shared/json-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { getUciMovesArrayFromPgn } from "@/lib/chess/getUciMovesArrayFromPgn";

type BulkItem = {
  title?: string;
  gameType?: string;
  pgn?: string;
  moves?: string;
  goals?: unknown;
};

const BULK_JSON_EXAMPLE = JSON.stringify(
  [
    {
      title: "Mate in 2 from setup FEN",
      gameType: "legend_games",
      pgn: VALID_PGN_EXAMPLE,
      moves: "e7e8 c8e8",
      themes: ["mate", "tactics"],
      isActive: true,
      goals: JSON.parse(GOALS_JSON_EXAMPLE),
    },
  ],
  null,
  2,
);

// ============================================================================
// Bulk Form
// Upload/paste JSON and validate each item before insert.
// ============================================================================
export function RiddleBulkForm() {
  const [jsonData, setJsonData] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const parsed = useMemo(() => {
    const trimmed = jsonData.trim();
    if (!trimmed) return { items: [] as BulkItem[], parseError: null as string | null };
    try {
      const data = JSON.parse(trimmed) as unknown;
      const arr = Array.isArray(data) ? data : [data];
      return { items: arr as BulkItem[], parseError: null };
    } catch (e) {
      return { items: [] as BulkItem[], parseError: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [jsonData]);

  const validationErrors = useMemo(() => {
    if (parsed.parseError) return [parsed.parseError];

    return parsed.items.flatMap((item, index) => {
      const row = index + 1;
      const errors: string[] = [];
      const title = item?.title?.trim();
      const gameType = item?.gameType?.trim();
      const pgn = item?.pgn?.trim();
      const moves = item?.moves?.trim();

      if (!title) errors.push(`Row ${row}: title is required`);
      if (!gameType) errors.push(`Row ${row}: gameType is required`);
      if (!moves) errors.push(`Row ${row}: moves is required and must be a string`);
      if (!pgn) {
        errors.push(`Row ${row}: pgn is required`);
      } else {
        if (!extractFenFromPgn(pgn)) errors.push(`Row ${row}: PGN must include [FEN "..."]`);
        const uciMoves = getUciMovesArrayFromPgn(pgn);
        if (!uciMoves?.length) errors.push(`Row ${row}: invalid PGN or moves cannot be derived`);
      }

      if (item?.goals !== undefined && item?.goals !== null && !Array.isArray(item.goals)) {
        errors.push(`Row ${row}: goals must be an array or null`);
      }

      return errors;
    });
  }, [parsed]);

  const canSubmit =
    Boolean(jsonData.trim()) && !parsed.parseError && parsed.items.length > 0 && validationErrors.length === 0;

  return (
    <form action={bulkCreateRiddlesFormAction} className="space-y-6">
      <Card className="ring-border rounded-lg ring-1">
        <CardHeader>
          <CardTitle>Bulk FEN Included PGN Import</CardTitle>
          <CardDescription>
            Upload a JSON file or paste JSON. Each entry is validated with the same required rules as single insert.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Field>
            <FieldLabel>Upload JSON file</FieldLabel>
            <label className="border-input bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-md border border-dashed p-4 transition-colors">
              <span className="bg-background rounded-md border p-2">
                <Upload className="text-muted-foreground h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-sm font-medium">Choose JSON file</span>
                <span className="text-muted-foreground block text-xs">
                  {uploadedFileName || "Upload a .json file to auto-fill the textarea"}
                </span>
              </span>
              <span className="text-muted-foreground text-xs">.json</span>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadedFileName(file.name);
                  const text = await file.text();
                  setJsonData(text);
                }}
              />
            </label>
          </Field>

          <Field>
            <FieldLabel>Paste JSON</FieldLabel>
            <div className="relative">
              {!jsonData.trim() ? (
                <pre
                  aria-hidden
                  className="border-input text-muted-foreground pointer-events-none absolute inset-0 overflow-hidden rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-sm leading-relaxed whitespace-pre-wrap"
                >
                  {BULK_JSON_EXAMPLE}
                </pre>
              ) : null}
              <textarea
                name="jsonData"
                rows={18}
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                spellCheck={false}
                className="border-input focus-visible:border-primary focus-visible:ring-primary/50 relative z-10 w-full rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              />
            </div>
          </Field>

          <p className="text-muted-foreground text-xs">Parsed items: {parsed.items.length}</p>
          {uploadedFileName ? (
            <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <FileJson className="h-3.5 w-3.5" />
              Loaded file: {uploadedFileName}
            </p>
          ) : null}

          {validationErrors.length > 0 ? (
            <div className="space-y-1">
              {validationErrors.map((err, idx) => (
                <p key={`${err}-${idx}`} className="text-destructive text-xs">
                  {err}
                </p>
              ))}
            </div>
          ) : null}

          <JsonViewer title="Last JSON to insert" data={jsonData.trim() ? jsonData : BULK_JSON_EXAMPLE} />

          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit}>
              Bulk insert riddles
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
