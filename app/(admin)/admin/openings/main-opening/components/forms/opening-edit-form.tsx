"use client";

import {
  updateOpeningAction,
  type UpdateOpeningFormState,
} from "@/app/(admin)/admin/openings/main-opening/actions/openings";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Opening } from "@/features/openings/types/opening";
import { useActionState } from "react";

type Props = {
  opening: Opening;
};

const initialState: UpdateOpeningFormState = { error: null };

export function OpeningEditForm({ opening }: Props) {
  const [state, formAction, isPending] = useActionState(
    updateOpeningAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="openingId" value={opening.id} />
      {state.error ? (
        <div
          className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            name="name"
            required
            defaultValue={opening.name}
            placeholder="e.g. Sicilian Defense"
          />
        </Field>
        <Field>
          <FieldLabel>Slug (URL)</FieldLabel>
          <Input
            name="slug"
            defaultValue={opening.slug ?? ""}
            placeholder="e.g. sicilian-defense"
          />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            name="description"
            defaultValue={opening.description ?? ""}
            placeholder="Optional description"
          />
        </Field>
        <Field>
          <FieldLabel>Display FEN</FieldLabel>
          <Input
            name="displayFen"
            defaultValue={opening.displayFen ?? ""}
            placeholder="e.g. rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
            className="font-mono text-sm"
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
