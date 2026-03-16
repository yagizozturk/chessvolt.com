"use client";

import type { Opening } from "@/features/openings/types/opening";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateOpeningAction } from "./opening-actions";
import { Button } from "@/components/ui/button";

type Props = {
  opening: Opening;
};

export function OpeningEditForm({ opening }: Props) {
  return (
    <form
      action={(formData) => updateOpeningAction(opening.id, formData)}
      className="space-y-4"
    >
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
      <Button type="submit">Save</Button>
    </form>
  );
}
