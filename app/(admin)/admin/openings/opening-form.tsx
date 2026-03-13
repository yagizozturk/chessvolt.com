"use client";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createOpeningAction } from "./opening-actions";
import { Button } from "@/components/ui/button";

export function OpeningForm() {
  return (
    <form action={createOpeningAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            name="name"
            required
            placeholder="e.g. Sicilian Defense"
          />
        </Field>
        <Field>
          <FieldLabel>ECO Code</FieldLabel>
          <Input name="ecoCode" placeholder="e.g. B20" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            name="description"
            placeholder="Optional description"
          />
        </Field>
        <Field>
          <FieldLabel>FEN</FieldLabel>
          <Input
            name="fen"
            placeholder="e.g. rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
            className="font-mono text-sm"
          />
        </Field>
      </FieldGroup>
      <Button type="submit">Add Opening</Button>
    </form>
  );
}
