// TODO: Refactor

"use client";

import { useState } from "react";

import { bulkImportPgnVariantsAction } from "@/app/(admin)/admin/openings/variants/actions/variants";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import type { Opening } from "@/features/openings/types/opening";

const EXAMPLE_PGNS = `[Event "London System Variants (3 levels): Bölüm 1 - Level 1"]
[Date "2026.07.08"]
[Result "*"]
[Variant "Standard"]
[ECO "D00"]
[Opening "Queen's Pawn Game: Accelerated London System"]
[StudyName "London System Variants (3 levels)"]
[ChapterName "Bölüm 1 - Level 1"]
[ChapterURL "https://lichess.org/study/4RkOJPCB/S2sEwv3V"]
[Annotator "https://lichess.org/@/Quantitative-Researc"]
[UTCDate "2026.07.08"]
[UTCTime "12:04:13"]

1. d4 d5 2. Bf4 Nf6 3. e3 e6 4. Nf3 Bd6 5. Bg3 O-O 6. Bd3 c5 7. c3 Nc6 8. Nbd2 b6 9. O-O Bb7 10. Qe2 Qe7 *


[Event "London System Variants (3 levels): Bölüm 2 - Level 1"]
[Date "2026.07.08"]
[Result "*"]
[Variant "Standard"]
[ECO "D00"]
[Opening "Queen's Pawn Game: Accelerated London System"]
[StudyName "London System Variants (3 levels)"]
[ChapterName "Bölüm 2 - Level 1"]
[ChapterURL "https://lichess.org/study/4RkOJPCB/P7fAUowy"]
[Annotator "https://lichess.org/@/Quantitative-Researc"]
[UTCDate "2026.07.08"]
[UTCTime "12:05:41"]

1. d4 d5 2. Bf4 Nf6 3. e3 Bf5 4. Nf3 e6 5. c4 c6 6. Nc3 Nbd7 7. Qb3 Qb6 8. c5 Qxb3 9. axb3 Be7 10. h3 O-O *`;

type Props = {
  openings: Opening[];
  defaultOpeningId?: string;
};

export function ImportVariantsForm({ openings, defaultOpeningId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action={async (formData: FormData) => {
        setIsSubmitting(true);
        await bulkImportPgnVariantsAction(formData);
        setIsSubmitting(false);
      }}
      className="space-y-4"
    >
      <p className="text-muted-foreground text-sm">
        Bir opening seçin ve birden fazla PGN yapıştırın. PGN&apos;ler boş satırlarla ayrılmalı.{" "}
        <span className="font-mono">sort_key</span> seçtiğiniz opening için mevcut en yüksek değerden artarak atanır.
      </p>
      <FieldGroup>
        <Field>
          <FieldLabel>Opening</FieldLabel>
          <select
            name="openingId"
            required
            defaultValue={defaultOpeningId ?? ""}
            className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          >
            <option value="">Select opening...</option>
            {openings.map((opening) => (
              <option key={opening.id} value={opening.id}>
                {opening.name}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <FieldLabel>PGN Text</FieldLabel>
          <textarea
            name="pgnText"
            required
            rows={20}
            placeholder={EXAMPLE_PGNS}
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "İşleniyor..." : "Varyantları Oluştur"}
      </Button>
    </form>
  );
}
