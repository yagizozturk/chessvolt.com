"use client";

import { useActionState } from "react";

import {
  type UpdateOpeningFormState,
  updateOpeningAction,
} from "@/app/(admin)/admin/openings/main-opening/actions/openings";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Opening } from "@/features/openings/types/opening";

type Props = {
  opening: Opening;
};

const initialState: UpdateOpeningFormState = { error: null };

export function OpeningEditForm({ opening }: Props) {
  const [state, formAction, isPending] = useActionState(updateOpeningAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="openingId" value={opening.id} />
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input name="name" required defaultValue={opening.name} placeholder="e.g. Sicilian Defense" />
        </Field>
        <Field>
          <FieldLabel>Slug (URL)</FieldLabel>
          <Input name="slug" defaultValue={opening.slug ?? ""} placeholder="e.g. sicilian-defense" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input name="description" defaultValue={opening.description ?? ""} placeholder="Optional description" />
        </Field>
        <Field>
          <FieldLabel>Type</FieldLabel>
          <Input name="openingType" defaultValue={opening.type ?? ""} placeholder="e.g. white, black, popular" />
        </Field>
        <Field>
          <FieldLabel>Arrows (JSON Array)</FieldLabel>
          <textarea
            name="arrows"
            defaultValue={opening.arrows ? JSON.stringify(opening.arrows, null, 2) : ""}
            placeholder='e.g. [{"orig":"e2","dest":"e4","brush":"green"}]'
            rows={8}
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
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
