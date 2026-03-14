"use client";

import { useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FileText, Upload } from "lucide-react";
import { importPgnAction } from "./actions";
import { cn } from "@/lib/utilities/cn";

/** Client-side game count for preview (avoids importing chess.js) */
function countPgnGames(pgn: string): number {
  const trimmed = pgn.trim();
  if (!trimmed) return 0;
  const parts = trimmed.split(/\n\s*\n(?=\[Event)/);
  return parts.filter((p) => {
    const t = p.trim();
    return t && (t.includes("[Event") || t.includes("1."));
  }).length;
}

const PLACEHOLDER = `[Event "Most Memorable Games in Chess History"]
[Date "2020.03.23"]
[Result "*"]
[White "Paul Morphy"]
[Black "Duke Karl & Count Isouard"]
1. e4 e5 2. Nf3 d6 ...


[Event "Berlin"]
[Date "1852.??.??"]
[White "Adolf Anderssen"]
[Black "Jean Dufresne"]
[Result "1-0"]
1. e4 e5 2. Nf3 Nc6 ...`;

export function ImportPgnForm() {
  const [pgn, setPgn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gameCount = useMemo(() => countPgnGames(pgn), [pgn]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setPgn(text);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);
    try {
      await importPgnAction(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="pgn" value={pgn} />

      <FieldGroup>
        <Field>
          <FieldLabel>Game Type</FieldLabel>
          <input
            type="text"
            name="gameType"
            placeholder="e.g. legend_games, magnus_plays, opening_crusher"
            className={cn(
              "border-input w-full max-w-xs rounded-md border bg-transparent px-3 py-2 text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              "placeholder:text-muted-foreground",
            )}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Tüm oyunlara atanacak challenge tipi (boş bırakılırsa legend_games)
          </p>
        </Field>
        <Field>
          <FieldLabel>Dosyadan Yükle</FieldLabel>
          <div className="flex flex-wrap items-center gap-2">
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
                {pgn.split("\n").length} lines
                {gameCount > 0 && (
                  <span className="text-primary font-medium">
                    • {gameCount} oyun tespit edildi
                  </span>
                )}
              </span>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel>veya PGN Yapıştır (oyunlar boş satırla ayrılmış)</FieldLabel>
          <textarea
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={16}
            className={cn(
              "border-input w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              "placeholder:text-muted-foreground",
            )}
          />
          {gameCount > 0 && (
            <p className="text-muted-foreground mt-1 text-sm">
              {gameCount} oyun içe aktarılacak
            </p>
          )}
        </Field>
      </FieldGroup>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={!pgn.trim() || isSubmitting}>
          {isSubmitting
            ? "İçe aktarılıyor…"
            : gameCount > 0
              ? `${gameCount} Oyunu İçe Aktar`
              : "İçe Aktar"}
        </Button>
        {isSubmitting && (
          <span className="text-muted-foreground text-sm">
            Lütfen bekleyin…
          </span>
        )}
      </div>
    </form>
  );
}
