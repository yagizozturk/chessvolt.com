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
          <FieldLabel>Type</FieldLabel>
          <Input name="openingType" placeholder="e.g. white, black, popular" />
        </Field>
        <Field>
          <FieldLabel>Display FEN</FieldLabel>
          <Input
            name="displayFen"
            placeholder="e.g. rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>Cover image</FieldLabel>
          <Input
            name="coverImageUrl"
            placeholder="Optional filename, e.g. sicilian.png"
            className="font-mono text-sm"
          />
          <p className="text-muted-foreground mt-1 text-xs">Filename under public/images/openings/</p>
        </Field>
        <Field>
          <FieldLabel>Cover color</FieldLabel>
          <Input name="coverImageColor" placeholder="Optional, e.g. #5D37BF" className="font-mono text-sm" />
        </Field>
      </FieldGroup>
      <Button type="submit">Add Opening</Button>
    </form>
  );
}
