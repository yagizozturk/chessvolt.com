"use client";

/// <reference path="../../../features/test/types/cm-pgn.d.ts" />
import { Pgn, type PgnMove } from "cm-pgn";
import { useState } from "react";

const SAMPLE_PGN = `[Site "Berlin"]
[Date "1989.07.02"]
[White "Haack, Stefan"]
[Black "Maier, Karsten"]
[Result "*"]

1. e4 e5 (1... e6 2. d4 d5) 2. Nf3 $1 {Great move!} Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 *`;

const SAMPLE_PGN_2 = `[Event "World Championship"]
[Site "London"]
[Date "2024.01.15"]
[White "Carlsen, Magnus"]
[Black "Nepomniachtchi, Ian"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 {Ruy Lopez} a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 1-0`;

export default function TestPage() {
  const [pgnInput, setPgnInput] = useState(SAMPLE_PGN);
  const [parsedData, setParsedData] = useState<{
    header: Record<string, string>;
    moves: Array<{
      ply: number;
      san: string;
      color: string;
      from: string;
      to: string;
      uci: string;
      fen: string;
      nag?: string;
      commentAfter?: string;
      variations?: string[][];
    }>;
    render: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function parsePgn() {
    setError(null);
    try {
      const pgn = new Pgn(pgnInput);
      const header = pgn.header.tags as Record<string, string>;
      const moves = (pgn.history.moves ?? []).map((m: PgnMove) => ({
        ply: m.ply as number,
        san: m.san as string,
        color: m.color as string,
        from: m.from as string,
        to: m.to as string,
        uci: m.uci as string,
        fen: m.fen as string,
        nag: m.nag as string | undefined,
        commentAfter: m.commentAfter as string | undefined,
        variations: m.variations?.map((v) => v.map((mv) => mv.san)),
      }));
      const render = pgn.render(true, true, true);
      setParsedData({ header, moves, render });
    } catch (err) {
      setError(err instanceof Error ? err.message : "PGN parse hatası");
      setParsedData(null);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-8">
      <h1 className="text-3xl font-bold">cm-pgn Test Sayfası</h1>
      <p className="text-muted-foreground">
        <a
          href="https://github.com/shaack/cm-pgn"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:no-underline"
        >
          cm-pgn
        </a>{" "}
        kütüphanesi ile PGN parse etme testi. Varyasyonlar, NAG&apos;lar ve yorumlar desteklenir.
      </p>

      <div className="space-y-4">
        <label className="block text-sm font-medium">PGN Girişi</label>
        <textarea
          className="w-full min-h-[200px] rounded-md border bg-muted/50 p-4 font-mono text-sm"
          value={pgnInput}
          onChange={(e) => setPgnInput(e.target.value)}
          placeholder="PGN metnini buraya yapıştırın..."
        />
        <button
          type="button"
          onClick={parsePgn}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Parse Et
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {parsedData && (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-xl font-semibold">Header (Etiketler)</h2>
            <div className="rounded-md border bg-muted/30 p-4">
              <pre className="overflow-x-auto text-sm">
                {JSON.stringify(parsedData.header, null, 2)}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">Hamleler ({parsedData.moves.length} hamle)</h2>
            <div className="space-y-2">
              {parsedData.moves.map((m, i) => (
                <div
                  key={i}
                  className="rounded-md border bg-card p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-medium text-muted-foreground">
                      #{m.ply}
                    </span>
                    <span className="rounded bg-primary/20 px-2 py-0.5 font-mono">
                      {m.san}
                    </span>
                    <span className="text-muted-foreground">
                      ({m.color === "w" ? "Beyaz" : "Siyah"})
                    </span>
                    <span className="text-muted-foreground">
                      {m.from} → {m.to}
                    </span>
                    <span className="text-muted-foreground">UCI: {m.uci}</span>
                    {m.nag && (
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-700 dark:text-amber-400">
                        NAG: {m.nag}
                      </span>
                    )}
                    {m.commentAfter && (
                      <span className="italic text-muted-foreground">
                        &quot;{m.commentAfter}&quot;
                      </span>
                    )}
                  </div>
                  {m.variations && m.variations.length > 0 && (
                    <div className="mt-2 pl-4 border-l-2 border-muted">
                      <span className="text-xs font-medium text-muted-foreground">
                        Varyasyonlar:
                      </span>
                      {m.variations.map((v, vi) => (
                        <div key={vi} className="mt-1 font-mono text-xs">
                          {v.join(" ")}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">Yeniden Render Edilmiş PGN</h2>
            <pre className="overflow-x-auto rounded-md border bg-muted/30 p-4 font-mono text-sm whitespace-pre-wrap">
              {parsedData.render}
            </pre>
          </section>
        </div>
      )}
    </div>
  );
}
