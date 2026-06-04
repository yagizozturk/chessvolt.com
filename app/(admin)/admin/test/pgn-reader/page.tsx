"use client";

import { Chess } from "chess.js";
import { useEffect, useState } from "react";

const SAMPLE = `1. e4 {Merkezi açıyor} e5 2. Nf3 {At gelişimi} Nc6 3. Bb5 {Ruy Lopez} a6`;

export default function PgnReaderPage() {
  const [pgn, setPgn] = useState(SAMPLE);
  const [rows, setRows] = useState<{ fen: string; comment: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  function read() {
    setError(null);
    try {
      const chess = new Chess();
      chess.loadPgn(pgn.trim(), { strict: false });
      setRows(chess.getComments());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Parse hatası");
      setRows([]);
    }
  }

  useEffect(() => {
    read();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ilk yüklemede örnek PGN
  }, []);

  return (
    <div className="mx-auto max-w-xl space-y-3 p-6">
      <textarea
        value={pgn}
        onChange={(e) => setPgn(e.target.value)}
        className="border-input h-40 w-full rounded-md border bg-transparent p-2 font-mono text-sm"
      />
      <button
        type="button"
        onClick={read}
        className="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm"
      >
        Oku
      </button>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <ul className="space-y-2">
        {rows.map(({ fen, comment }, i) => (
          <li key={i} className="rounded-md border p-2 text-sm">
            <p className="text-muted-foreground mb-1 font-mono text-xs break-all">
              {fen}
            </p>
            <p>{comment}</p>
          </li>
        ))}
      </ul>
      {rows.length === 0 && !error && (
        <p className="text-muted-foreground text-sm">
          Oku ile yorumları listele.
        </p>
      )}
    </div>
  );
}
