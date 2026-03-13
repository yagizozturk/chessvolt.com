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
          <FieldLabel>ECO Code</FieldLabel>
          <Input
            name="ecoCode"
            defaultValue={opening.ecoCode ?? ""}
            placeholder="e.g. B20"
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
      </FieldGroup>
      <Button type="submit">Save</Button>
    </form>
  );
}
