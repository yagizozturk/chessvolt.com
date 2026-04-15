"use client";

import { createOpeningVariantAction } from "@/app/(admin)/admin/openings/variants/actions/variants";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import VoltBoard from "@/components/volt-board/volt-board";
import type { Opening } from "@/features/openings/types/opening";
import type { MoveGoal } from "@/features/openings/types/opening-variant";
import { isMoveGoalsArray } from "@/features/openings/validation/opening-variant-goals";
import { getUciMovesArrayFromPgn } from "@/lib/chess/getUciMovesArrayFromPgn";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";
import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";

const START_FEN = new Chess().fen();

function applyUci(game: Chess, uci: string) {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion =
    uci.length > 4 ? (uci[4] as "q" | "r" | "b" | "n") : undefined;
  return game.move({
    from,
    to,
    ...(promotion ? { promotion } : {}),
  });
}

function useUciRowsFromPgn(pgn: string) {
  return useMemo(() => {
    const trimmed = pgn.trim();
    if (!trimmed) {
      return {
        rows: [] as { num: number; white: string; black?: string }[],
        error: null as string | null,
        fen: null as string | null,
        fensByPly: [START_FEN] as string[],
        uciMoves: [] as string[],
      };
    }
    try {
      const game = new Chess();
      game.loadPgn(trimmed, { strict: false });
      const fen = game.fen();
      const uciMovesRaw = getUciMovesArrayFromPgn(pgn);
      if (!uciMovesRaw || uciMovesRaw.length === 0) {
        return {
          rows: [],
          error: null,
          fen,
          fensByPly: [fen],
          uciMoves: [] as string[],
        };
      }
      const uciMoves = uciMovesRaw;
      const rows: { num: number; white: string; black?: string }[] = [];
      for (let i = 0; i < uciMoves.length; i += 2) {
        rows.push({
          num: Math.floor(i / 2) + 1,
          white: uciMoves[i]!,
          ...(uciMoves[i + 1] !== undefined ? { black: uciMoves[i + 1] } : {}),
        });
      }

      const replay = new Chess();
      const fensByPly: string[] = [replay.fen()];
      for (const uci of uciMoves) {
        applyUci(replay, uci);
        fensByPly.push(replay.fen());
      }

      return { rows, error: null, fen, fensByPly, uciMoves };
    } catch (e) {
      return {
        rows: [] as { num: number; white: string; black?: string }[],
        error: e instanceof Error ? e.message : "PGN could not be parsed",
        fen: null,
        fensByPly: [START_FEN] as string[],
        uciMoves: [] as string[],
      };
    }
  }, [pgn]);
}

function useParsedOpeningJson(jsonInput: string) {
  return useMemo(() => {
    const trimmed = jsonInput.trim();
    if (!trimmed) {
      return {
        record: null as Record<string, unknown> | null,
        error: null as string | null,
      };
    }
    try {
      const parsed: unknown = JSON.parse(trimmed);
      let obj: unknown = parsed;
      if (Array.isArray(parsed)) {
        obj = parsed[0];
      }
      if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
        return { record: obj as Record<string, unknown>, error: null };
      }
      return {
        record: null,
        error: "JSON must be an object or an array of objects.",
      };
    } catch (e) {
      return {
        record: null,
        error: e instanceof Error ? e.message : "Invalid JSON",
      };
    }
  }, [jsonInput]);
}

type BoardWithMovesProps = {
  sourceId: string;
  title: string;
  boardFen: string;
  rows: { num: number; white: string; black?: string }[];
  error: string | null;
  uciMoves: string[];
  safePly: number;
  maxPly: number;
  setSelectedPly: (ply: number) => void;
};

function BoardWithMoves({
  sourceId,
  title,
  boardFen,
  rows,
  error,
  uciMoves,
  safePly,
  maxPly,
  setSelectedPly,
}: BoardWithMovesProps) {
  return (
    <section
      className="flex flex-col gap-4"
      aria-labelledby={`${sourceId}-heading`}
    >
      <h2
        id={`${sourceId}-heading`}
        className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
      >
        {title}
      </h2>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <VoltBoard
          key={`${sourceId}-${boardFen}`}
          sourceId={sourceId}
          moves=""
          initialFen={boardFen}
          width={380}
          height={380}
          viewOnly
        />
        <div className="min-h-[200px] min-w-0 flex-1">
          <p className="text-muted-foreground mb-2 text-sm font-medium">
            UCI hamleler
          </p>
          {error && <p className="text-destructive mb-2 text-sm">{error}</p>}
          {uciMoves.length > 0 && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground mb-2 text-xs underline"
              onClick={() => setSelectedPly(0)}
            >
              Başlangıç pozisyonu
            </button>
          )}
          <div
            className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-sm leading-relaxed"
            role="list"
          >
            {rows.map((r) => {
              const whiteIdx = (r.num - 1) * 2;
              const blackIdx = (r.num - 1) * 2 + 1;
              return (
                <div
                  key={r.num}
                  role="listitem"
                  className="flex shrink-0 flex-wrap items-baseline gap-1"
                >
                  <span className="text-muted-foreground w-6 shrink-0 text-right">
                    {r.num}.
                  </span>
                  <button
                    type="button"
                    className={`hover:bg-muted rounded px-1.5 py-0.5 transition-colors ${
                      safePly === whiteIdx + 1
                        ? "bg-primary/20 font-medium"
                        : ""
                    }`}
                    onClick={() => setSelectedPly(whiteIdx + 1)}
                  >
                    {r.white}
                  </button>
                  {r.black !== undefined && (
                    <button
                      type="button"
                      className={`hover:bg-muted rounded px-1.5 py-0.5 transition-colors ${
                        safePly === blackIdx + 1
                          ? "bg-primary/20 font-medium"
                          : ""
                      }`}
                      onClick={() => setSelectedPly(blackIdx + 1)}
                    >
                      {r.black}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {uciMoves.length > 0 && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground mt-3 text-xs underline"
              onClick={() => setSelectedPly(maxPly)}
            >
              Son pozisyon
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function pgnFromJsonRecord(record: Record<string, unknown> | null): string {
  if (!record) return "";
  const p = record.pgn;
  return typeof p === "string" ? p : "";
}

function sortKeyFromRecord(record: Record<string, unknown> | null): number {
  if (!record) return 1;
  const s = record.sort_key;
  if (typeof s === "number" && Number.isFinite(s)) return Math.trunc(s);
  if (typeof s === "string") {
    const n = parseInt(s, 10);
    if (!Number.isNaN(n)) return n;
  }
  return 1;
}

/** `goals` yalnızca ana JSON’dan okunur. */
function parseGoalsFromRecord(
  record: Record<string, unknown> | null,
):
  | { ok: true; goals: MoveGoal[] | null }
  | { ok: false; error: string } {
  if (!record) return { ok: true, goals: null };
  if (!("goals" in record)) return { ok: true, goals: null };
  const g = record.goals;
  if (g === undefined || g === null) return { ok: true, goals: null };
  if (!Array.isArray(g)) {
    return { ok: false, error: "goals must be an array." };
  }
  if (!isMoveGoalsArray(g)) {
    return {
      ok: false,
      error:
        "goals must include ply (number), move, title, description (string), and isCompleted (boolean). card is optional.",
    };
  }
  return { ok: true, goals: g };
}

type Props = {
  openings: Opening[];
  defaultOpeningId?: string;
};

export function JsonVariantForm({ openings, defaultOpeningId }: Props) {
  const [jsonInput, setJsonInput] = useState("");
  const [openingId, setOpeningId] = useState(defaultOpeningId ?? "");
  const [groupEdit, setGroupEdit] = useState("");
  const [titleEdit, setTitleEdit] = useState("");
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [sortKeyEdit, setSortKeyEdit] = useState("1");

  useEffect(() => {
    setOpeningId(defaultOpeningId ?? "");
  }, [defaultOpeningId]);

  const { record: jsonRecord, error: jsonError } =
    useParsedOpeningJson(jsonInput);

  useEffect(() => {
    if (!jsonRecord) {
      setGroupEdit("");
      setTitleEdit("");
      setDescriptionEdit("");
      setSortKeyEdit("1");
      return;
    }
    setGroupEdit(
      typeof jsonRecord.group === "string"
        ? jsonRecord.group
        : typeof jsonRecord.level === "string"
          ? jsonRecord.level
          : "",
    );
    setTitleEdit(
      typeof jsonRecord.title === "string" ? jsonRecord.title : "",
    );
    setDescriptionEdit(
      typeof jsonRecord.description === "string"
        ? jsonRecord.description
        : "",
    );
    setSortKeyEdit(String(sortKeyFromRecord(jsonRecord)));
  }, [jsonRecord]);
  const pgnFromJson = useMemo(
    () => pgnFromJsonRecord(jsonRecord),
    [jsonRecord],
  );
  const { rows, error, fensByPly, uciMoves } = useUciRowsFromPgn(pgnFromJson);
  const maxPly = Math.max(0, fensByPly.length - 1);

  const [selectedPlyInitial, setSelectedPlyInitial] = useState(0);
  const [selectedPlyDisplay, setSelectedPlyDisplay] = useState(0);

  useEffect(() => {
    setSelectedPlyInitial(maxPly);
    setSelectedPlyDisplay(maxPly);
  }, [pgnFromJson, maxPly]);

  const safePlyInitial = Math.min(Math.max(0, selectedPlyInitial), maxPly);
  const safePlyDisplay = Math.min(Math.max(0, selectedPlyDisplay), maxPly);
  const initialFen = fensByPly[safePlyInitial] ?? START_FEN;
  const displayFen = fensByPly[safePlyDisplay] ?? START_FEN;

  const sortKeyNum = useMemo(() => {
    const n = parseInt(sortKeyEdit.trim(), 10);
    return Number.isNaN(n) ? 1 : n;
  }, [sortKeyEdit]);

  /** Seçilen initial ply’den oyun sonuna kadar UCI hamleleri (boşlukla ayrılmış). */
  const movesFromInitialPly = useMemo(() => {
    const pgn = pgnFromJson.trim();
    if (!pgn) return "";
    const s = getUciMovesFromPgnAfterPly(pgn, safePlyInitial);
    return s ?? "";
  }, [pgnFromJson, safePlyInitial]);

  const goalsFromJson = useMemo(
    () => parseGoalsFromRecord(jsonRecord),
    [jsonRecord],
  );

  const goalsFormValue = useMemo(() => {
    if (!goalsFromJson.ok || goalsFromJson.goals === null) return "";
    return JSON.stringify(goalsFromJson.goals);
  }, [goalsFromJson]);

  const mergedJsonForExport = useMemo(() => {
    const base =
      jsonRecord && !jsonError
        ? { ...jsonRecord }
        : ({} as Record<string, unknown>);
    const out: Record<string, unknown> = {
      ...base,
      group: groupEdit,
      title: titleEdit,
      description: descriptionEdit,
      sort_key: sortKeyNum,
      initial_fen: initialFen,
      display_fen: displayFen,
      moves: movesFromInitialPly,
      ply: safePlyInitial,
    };
    if (!goalsFromJson.ok) {
      delete out.goals;
    } else if (goalsFromJson.goals === null) {
      delete out.goals;
    }
    return out;
  }, [
    jsonRecord,
    jsonError,
    initialFen,
    displayFen,
    groupEdit,
    titleEdit,
    descriptionEdit,
    sortKeyNum,
    goalsFromJson,
    movesFromInitialPly,
    safePlyInitial,
  ]);

  const mergedJsonString = useMemo(
    () => JSON.stringify(mergedJsonForExport, null, 2),
    [mergedJsonForExport],
  );

  const canSubmit =
    Boolean(openingId?.trim()) &&
    Boolean(groupEdit.trim()) &&
    Boolean(pgnFromJson.trim()) &&
    !jsonError &&
    !error &&
    goalsFromJson.ok;

  return (
    <div className="max-w-[110rem] space-y-6">
      <form action={createOpeningVariantAction} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="json-variant-opening" className="text-sm font-medium">
            Opening
          </label>
          <select
            id="json-variant-opening"
            name="openingId"
            required
            value={openingId}
            onChange={(e) => setOpeningId(e.target.value)}
            className="border-input focus-visible:ring-ring w-full max-w-md rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            <option value="">Select opening...</option>
            {openings.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="json-variant-group">Group</FieldLabel>
            <Input
              id="json-variant-group"
              name="group"
              required
              value={groupEdit}
              onChange={(e) => setGroupEdit(e.target.value)}
              placeholder="beginner"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="json-variant-title">Title</FieldLabel>
            <Input
              id="json-variant-title"
              name="title"
              value={titleEdit}
              onChange={(e) => setTitleEdit(e.target.value)}
              placeholder="Varyant başlığı"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="json-variant-description">
              Description
            </FieldLabel>
            <textarea
              id="json-variant-description"
              name="description"
              value={descriptionEdit}
              onChange={(e) => setDescriptionEdit(e.target.value)}
              rows={3}
              placeholder="İsteğe bağlı açıklama"
              className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="json-variant-sort-key">Sort key</FieldLabel>
            <input type="hidden" name="sortKey" value={String(sortKeyNum)} />
            <Input
              id="json-variant-sort-key"
              type="number"
              min={0}
              value={sortKeyEdit}
              onChange={(e) => setSortKeyEdit(e.target.value)}
              className="font-mono"
            />
          </Field>
        </FieldGroup>

        <input type="hidden" name="pgn" value={pgnFromJson} />
        <input type="hidden" name="ply" value={safePlyInitial} />
        <input type="hidden" name="initialFen" value={initialFen} />
        <input type="hidden" name="displayFen" value={displayFen} />
        <input type="hidden" name="goals" value={goalsFormValue} />

        <div className="border-input bg-muted/30 rounded-md border p-3">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                initialFen (sol board)
              </p>
              <p className="font-mono text-xs break-all">{initialFen}</p>
              <p className="text-muted-foreground mt-2 text-xs">
                Seçilen ply:{" "}
                <span className="text-foreground font-mono tabular-nums">
                  {safePlyInitial}
                </span>
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                displayFen (sağ board)
              </p>
              <p className="font-mono text-xs break-all">{displayFen}</p>
              <p className="text-muted-foreground mt-2 text-xs">
                Seçilen ply:{" "}
                <span className="text-foreground font-mono tabular-nums">
                  {safePlyDisplay}
                </span>
              </p>
            </div>
          </div>
          <p className="text-muted-foreground border-border mt-3 border-t pt-3 text-[11px] leading-relaxed">
            <span className="text-foreground/80 font-medium">Note: </span>
            The selected ply is the number of half-moves played. If it is odd,
            it is Black&apos;s turn; if it is even, it is White&apos;s turn. If
            it is odd, board orientation is Black; if it is even, board
            orientation is White.
          </p>
        </div>

        <div className="grid gap-10 xl:grid-cols-2">
          <BoardWithMoves
            sourceId="json-variant-initial"
            title="Sol — initial"
            boardFen={initialFen}
            rows={rows}
            error={error}
            uciMoves={uciMoves}
            safePly={safePlyInitial}
            maxPly={maxPly}
            setSelectedPly={setSelectedPlyInitial}
          />
          <BoardWithMoves
            sourceId="json-variant-display"
            title="Sağ — display"
            boardFen={displayFen}
            rows={rows}
            error={error}
            uciMoves={uciMoves}
            safePly={safePlyDisplay}
            maxPly={maxPly}
            setSelectedPly={setSelectedPlyDisplay}
          />
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">JSON</p>
          <p className="text-muted-foreground text-xs">
            Tahta <span className="font-mono">pgn</span> ile.{" "}
            <span className="font-mono">goals</span> dizi olarak bu JSON içinde
            düzenlenir.
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="border-input h-48 w-full rounded-md border bg-transparent p-2 font-mono text-sm"
            placeholder='{"title": "...", "pgn": "...", "goals": [ ... ], ...}'
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
          />
          {jsonError && (
            <p className="text-destructive text-sm">{jsonError}</p>
          )}
          {jsonRecord && !goalsFromJson.ok && (
            <p className="text-destructive text-sm">{goalsFromJson.error}</p>
          )}
        </div>

        <div className="border-input bg-muted/30 rounded-md border p-4">
          <p className="text-muted-foreground mb-1 text-sm font-medium">
            JSON (son hal)
          </p>
          <p className="text-muted-foreground mb-3 text-xs">
            Sol tahtadaki pozisyon{" "}
            <span className="font-mono">initial_fen</span>, sağdaki{" "}
            <span className="font-mono">display_fen</span> olarak eklenir;
            yapıştırdığın nesnenin diğer alanları korunur.
          </p>
          <pre className="border-input bg-background max-h-[min(28rem,70vh)] overflow-auto rounded-md border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {mergedJsonString}
          </pre>
        </div>

        <Button type="submit" disabled={!canSubmit}>
          Varyantı oluştur
        </Button>
        {!canSubmit && (
          <p className="text-muted-foreground text-xs">
            Select an opening, set a group, provide valid JSON and{" "}
            <span className="font-mono">pgn</span>; if{" "}
            <span className="font-mono">goals</span> is present, it must follow
            the schema (<span className="font-mono">card</span> is optional).
          </p>
        )}
      </form>
    </div>
  );
}
