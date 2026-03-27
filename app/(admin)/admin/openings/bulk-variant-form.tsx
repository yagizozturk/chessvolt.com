"use client";

import { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { bulkCreateVariantsAction } from "./actions";

const EXAMPLE_JSON = `{
  "opening_id": "7dfa1d04-bb0c-4f63-80ec-5169bb15a47a",
  "sort_key": 201,
  "title": "c5 Line: Queen Check Defense (Qa5+)",
  "pgn": "1.d4 d5 2.Nc3 Nf6 3.Bf4 c5 4.e3 Nc6 5.Nb5 e5 6.Bxe5 Nxe5 7.dxe5 Ne4 8.Qxd5 Qa5+ 9.c3 Bf5 10.Bc4 Bg6 11.Qxb7",
  "initial_fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "initial_ply": 0,
  "display_ply": 4,
  "description": "Black attempts a disruptive check, but White's attack is too strong.",
  "goals": [
    { "sort_key": 1, "move": "d4", "card": "Center", "title": "Build the center", "description": "Solid pawn structure." },
    { "sort_key": 2, "move": "Nf3", "card": "Development", "title": "Piece activity", "description": "Coordinate pieces toward the king." }
  ]
}`;

export function BulkVariantForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action={async (formData: FormData) => {
        setIsSubmitting(true);
        const jsonData = (formData.get("jsonData") as string) ?? "";
        await bulkCreateVariantsAction(jsonData);
        setIsSubmitting(false);
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>JSON Verisi</FieldLabel>
          <textarea
            name="jsonData"
            required
            rows={16}
            placeholder={EXAMPLE_JSON}
            className="border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "İşleniyor..." : "Varyantları Oluştur"}
      </Button>
    </form>
  );
}
