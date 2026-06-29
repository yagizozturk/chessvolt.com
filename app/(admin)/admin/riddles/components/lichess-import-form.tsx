"use client";

import { useActionState } from "react";

import { importLichessAction } from "@/app/(admin)/admin/riddles/actions/import-lichess-action";
import { DEFAULT_LICHESS_IMPORT_CONFIG } from "@/app/(admin)/admin/riddles/lib/lichess/types";
import type { LichessImportFormState } from "@/app/(admin)/admin/riddles/lib/riddle-form-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: LichessImportFormState = { error: null };

export function LichessImportForm() {
  const [state, formAction, isPending] = useActionState(importLichessAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}

      {state.summary ? (
        <div className="space-y-2 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm">
          <p>
            Imported {state.summary.imported}, skipped duplicates {state.summary.skippedDuplicate}, skipped by filter{" "}
            {state.summary.skippedFilter}, errors {state.summary.errors}.
          </p>
          {state.summary.unknownLichessThemes.length > 0 ? (
            <p className="text-xs">
              Unknown Lichess tags (used fallback category): {state.summary.unknownLichessThemes.join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Lichess CSV import</CardTitle>
          <CardDescription>
            Columns: PuzzleId, FEN, Moves, Rating, Popularity, Themes, OpeningTags. RatingDeviation and NbPlays are
            ignored. The first move in Moves is played automatically to reach the puzzle position and is not stored.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Min popularity</FieldLabel>
              <Input
                name="minPopularity"
                type="number"
                min={0}
                defaultValue={String(DEFAULT_LICHESS_IMPORT_CONFIG.minPopularity)}
              />
            </Field>
            <Field>
              <FieldLabel>CSV data</FieldLabel>
              <textarea
                name="csvData"
                rows={16}
                required
                className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-xs shadow-xs outline-none focus-visible:ring-[3px]"
                placeholder="PuzzleId,FEN,Moves,Rating,Popularity,Themes,OpeningTags"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Importing…" : "Import riddles"}
      </Button>
    </form>
  );
}
