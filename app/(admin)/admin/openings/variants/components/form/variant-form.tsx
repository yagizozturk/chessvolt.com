"use client";

import { createOpeningVariantAction } from "@/app/(admin)/admin/openings/variants/actions/variants";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Opening } from "@/features/openings/types/opening";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";
import { useState } from "react";

type Props = {
  openings: Opening[];
  defaultOpeningId?: string;
};

export function VariantForm({ openings, defaultOpeningId }: Props) {
  const [pgn, setPgn] = useState("");
  const [ply, setPly] = useState("0");
  const plyNum = parseInt(ply, 10) >= 0 ? parseInt(ply, 10) : 0;
  const derivedMoves = pgn
    ? (getUciMovesFromPgnAfterPly(pgn, plyNum) ?? "")
    : "";

  return (
    <form action={createOpeningVariantAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Opening</FieldLabel>
          <select
            name="openingId"
            required
            defaultValue={defaultOpeningId ?? ""}
            className="border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            <option value="">Select opening...</option>
            {openings.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <FieldLabel>Sort Key</FieldLabel>
          <Input
            name="sortKey"
            type="number"
            required
            placeholder="Sıra numarası (örn: 1, 2)"
            className="font-mono"
          />
        </Field>
        <Field>
          <FieldLabel>Group</FieldLabel>
          <Input name="group" required placeholder="e.g. beginner" />
        </Field>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" placeholder="e.g. Sicilian Defense" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            name="description"
            placeholder="Optional variant description"
          />
        </Field>
        <Field>
          <FieldLabel>
            Ply (başlangıç hamle indeksi, 0 = tüm hamleler)
          </FieldLabel>
          <Input
            name="ply"
            type="number"
            min={0}
            value={ply}
            onChange={(e) => setPly(e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field>
          <FieldLabel>PGN</FieldLabel>
          <textarea
            name="pgn"
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            required
            rows={6}
            placeholder="1. e4 e5 2. Nf3 Nc6 3. Bb5 ..."
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-base text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        </Field>
        <Field>
          <FieldLabel>Moves (UCI)</FieldLabel>
          <Input
            readOnly
            value={derivedMoves}
            placeholder="PGN'den hesaplanır"
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>Initial FEN</FieldLabel>
          <Input
            name="initialFen"
            placeholder="PGN+ply'den türetilir (opsiyonel)"
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>Display FEN</FieldLabel>
          <Input
            name="displayFen"
            placeholder="Kart görüntüsü için (opsiyonel)"
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>Goals (JSON)</FieldLabel>
          <textarea
            name="goals"
            rows={4}
            placeholder='[{"ply":1,"move":"Bf4","card":"...","title":"...","description":"...","isCompleted":false}]'
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        </Field>
        <Field>
          <FieldLabel>Ideas (JSON object)</FieldLabel>
          <textarea
            name="ideas"
            rows={4}
            placeholder='{"objective":"...","core_idea":"...","common_mistake":"..."}'
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        </Field>
      </FieldGroup>
      <Button type="submit">Create Variant</Button>
    </form>
  );
}
