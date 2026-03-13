"use client";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createOpeningVariantAction } from "./actions";
import { Button } from "@/components/ui/button";

type Props = {
  openings: { id: string; slug: string; name: string | null }[];
};

export function VariantForm({ openings }: Props) {
  return (
    <form action={createOpeningVariantAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Opening</FieldLabel>
          <select
            name="openingId"
            required
            className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <option value="">Select opening...</option>
            {openings.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name ?? o.slug} ({o.slug})
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" placeholder="e.g. Sicilian Defense" />
        </Field>
        <Field>
          <FieldLabel>ECO Code</FieldLabel>
          <Input name="ecoCode" placeholder="e.g. B20" />
        </Field>
        <Field>
          <FieldLabel>Moves (SAN)</FieldLabel>
          <Input
            name="moves"
            required
            placeholder="e4 e5 Nf3 Nc6 ..."
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>FEN</FieldLabel>
          <Input
            name="fen"
            placeholder="Position after moves (optional)"
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>Ply</FieldLabel>
          <Input
            name="ply"
            type="number"
            defaultValue="0"
            placeholder="0"
          />
        </Field>
      </FieldGroup>
      <Button type="submit">Create Variant</Button>
    </form>
  );
}
