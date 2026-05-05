"use client";

import { createOpeningAction } from "@/app/(admin)/admin/openings/main-opening/actions/openings";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function OpeningForm() {
  return (
    <form action={createOpeningAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input name="name" required placeholder="e.g. Sicilian Defense" />
        </Field>
        <Field>
          <FieldLabel>Slug (URL)</FieldLabel>
          <Input name="slug" placeholder="e.g. sicilian-defense (auto from name if empty)" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input name="description" placeholder="Optional description" />
        </Field>
        <Field>
          <FieldLabel>Arrows (JSON Array)</FieldLabel>
          <textarea
            name="arrows"
            placeholder='e.g. [{"orig":"e2","dest":"e4","brush":"green"}]'
            rows={6}
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
          />
        </Field>
        <Field>
          <FieldLabel>Display FEN</FieldLabel>
          <Input
            name="displayFen"
            placeholder="e.g. rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
            className="font-mono text-sm"
          />
        </Field>
      </FieldGroup>
      <Button type="submit">Add Opening</Button>
    </form>
  );
}
