"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FileText, Upload } from "lucide-react";
import { importPgnAction } from "./actions";
import { cn } from "@/lib/utils";

export function ImportPgnForm() {
  const [pgn, setPgn] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setPgn(text);
    e.target.value = "";
  }

  return (
    <form action={importPgnAction} className="space-y-4">
      <input type="hidden" name="pgn" value={pgn} />

      <FieldGroup>
        <Field>
          <FieldLabel>Dosyadan Yükle</FieldLabel>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pgn,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              PGN Dosyası Seç
            </Button>
            {pgn && (
              <span className="text-muted-foreground flex items-center gap-1 text-sm">
                <FileText className="h-4 w-4" />
                {pgn.split("\n").length} satır yüklendi
              </span>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel>veya PGN Yapıştır</FieldLabel>
          <textarea
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            placeholder={`[Event "FIDE World Championship"]
[Site "London"]
[Date "2018.11.09"]
[White "Carlsen, Magnus"]
[Black "Caruana, Fabiano"]
[Result "1/2-1/2"]

1. e4 e5 2. Nf3 Nc6 ...`}
            rows={12}
            className={cn(
              "border-input w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              "placeholder:text-muted-foreground",
            )}
          />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={!pgn.trim()}>
        Import Et
      </Button>
    </form>
  );
}
