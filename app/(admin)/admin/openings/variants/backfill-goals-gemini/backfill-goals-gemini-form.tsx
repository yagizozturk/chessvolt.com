"use client";

import { useActionState } from "react";

import {
  backfillOpeningVariantGoalsGeminiAction,
  type BackfillOpeningGoalsGeminiFormState,
} from "@/app/(admin)/admin/openings/variants/actions/backfill-goals-gemini";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: BackfillOpeningGoalsGeminiFormState = { error: null, result: null };

export function BackfillOpeningGoalsGeminiForm() {
  const [state, formAction, isPending] = useActionState(
    backfillOpeningVariantGoalsGeminiAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <div
          className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      {state.result ? (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm">
          <p>
            Processed {state.result.processed}, succeeded {state.result.succeeded}, failed{" "}
            {state.result.failed}
            {state.result.dryRun ? " (dry run)" : ""}.
          </p>
          {state.result.errors.length > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs">
              {state.result.errors.map((err) => (
                <li key={`${err.id}-${err.message}`}>
                  {err.id}: {err.message}
                </li>
              ))}
            </ul>
          ) : null}
          {state.result.previews && state.result.previews.length > 0 ? (
            <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-black/5 p-3 text-xs">
              {JSON.stringify(state.result.previews, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Generate opening goals with Gemini</CardTitle>
          <CardDescription>
            Fetches opening variants whose linked move sequence has null goals, calls Google Gemini,
            and writes goals to move_sequences plus title and description to opening_variants.
            Process a small batch at a time to avoid timeouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Batch limit</FieldLabel>
              <Input name="limit" type="number" min={1} max={50} defaultValue={1} />
            </Field>
            <Field>
              <FieldLabel>Variant ID (optional)</FieldLabel>
              <Input
                name="variantId"
                placeholder="Backfill a single variant for debugging"
                className="font-mono text-xs"
              />
            </Field>
            <Field className="flex flex-row items-center gap-2">
              <input id="dryRunOpeningGemini" name="dryRun" type="checkbox" />
              <FieldLabel htmlFor="dryRunOpeningGemini" className="mb-0">
                Dry run (validate only, do not write)
              </FieldLabel>
            </Field>
          </FieldGroup>
          <Button type="submit" className="mt-4" disabled={isPending}>
            {isPending ? "Running…" : "Run backfill"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
