"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createRepAction } from "./actions";
import { Button } from "@/components/ui/button";

export function RepForm() {
  return (
    <form action={createRepAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" placeholder="Repertoire başlığı" />
        </Field>
        <Field>
          <FieldLabel>Opening Name</FieldLabel>
          <Input name="openingName" placeholder="örn: Sicilian Defense" />
        </Field>
        <Field>
          <FieldLabel>Moves (UCI)</FieldLabel>
          <Input
            name="moves"
            required
            placeholder="e2e4 e7e5 g1f3 ..."
          />
        </Field>
        <Field>
          <FieldLabel>Ply</FieldLabel>
          <Input name="ply" type="number" placeholder="Opsiyonel" />
        </Field>
        <Field>
          <FieldLabel>PGN</FieldLabel>
          <Input
            name="pgn"
            placeholder="Opsiyonel - pozisyon pgn+ply ile üretilir"
            className="font-mono text-sm"
          />
        </Field>
      </FieldGroup>
      <Button type="submit">Oluştur</Button>
    </form>
  );
}
