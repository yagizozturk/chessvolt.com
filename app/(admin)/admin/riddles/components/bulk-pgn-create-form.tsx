"use client";

import { useActionState } from "react";

import { bulkCreateAction } from "@/app/(admin)/admin/riddles/actions/bulk-create-action";
import type { BulkCreateFormState } from "@/app/(admin)/admin/riddles/lib/riddle-form-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Collection } from "@/features/collection/types/collection";

const initialState: BulkCreateFormState = { error: null };

const PLACEHOLDER_PGNS = `[Event "?"]
[Site "?"]
[Date "2018.09.19"]
[Round "?"]
[White "32-9"]
[Black "?"]
[Result "*"]
[SetUp "1"]
[FEN "8/p1P2R2/k1r5/P7/8/1K6/8/8 w - - 0 1"]
[PlyCount "7"]

1. Rf6 Rxf6 2. c8=Q+ Kb5 3. Qc4+ Kxa5 4. Qc3+ *

[Event "?"]
[Site "?"]
[Date "2018.09.19"]
[Round "?"]
[White "33-1"]
[Black "?"]
[Result "*"]
[SetUp "1"]
[FEN "r4r2/1pp1qpk1/p1n2p2/4PQ2/3p4/2N5/PP3PPP/3R2K1 w - - 0 1"]
[PlyCount "7"]

1. Qg4+ Kh8 2. Rd3 fxe5 3. Rh3+ Qh4 4. Rxh4# *`;

type Props = {
  collections: Collection[];
};

export function BulkPgnCreateForm({ collections }: Props) {
  const [state, formAction, isPending] = useActionState(bulkCreateAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}

      {state.summary ? (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm">
          <p>
            Created {state.summary.created}, failed {state.summary.failed}.
          </p>
          {state.summary.errors.length > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs">
              {state.summary.errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Bulk PGN import</CardTitle>
          <CardDescription>
            Paste multiple PGNs separated by a blank line. Each game uses default plies (initial 0, display 0, end =
            last move). Titles are numbered Riddle 1, Riddle 2, … Source ID is derived from White/Black headers when
            present.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Source (applied to all)</FieldLabel>
              <Input name="source" placeholder="e.g. respond_to_check" />
            </Field>
            <Field>
              <FieldLabel>Default collection (optional)</FieldLabel>
              <select
                name="collectionId"
                className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              >
                <option value="">None</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel>PGN text</FieldLabel>
              <textarea
                name="pgnText"
                rows={20}
                required
                placeholder={PLACEHOLDER_PGNS}
                className="border-input placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-xs shadow-xs outline-none focus-visible:ring-[3px]"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Importing…" : "Bulk create"}
      </Button>
    </form>
  );
}
