"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AdminPgnBoardPicker } from "@/features/admin/components/admin-pgn-board-picker";
import { START_FEN, useUciRowsFromPgn } from "@/features/admin/hooks/use-uci-rows-from-pgn";
import type { Game } from "@/features/game/types/game";
import { getUciMovesFromPgnAfterPlyAtMoveCount } from "@/lib/chess/getUciMovesFromPgnAfterPlyAtMoveCount";
import { cn } from "@/lib/utils/cn";

import { createRiddleAction } from "./actions";

type Props = {
  games: Game[];
};

export function RiddleForm({ games }: Props) {
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  const [gameId, setGameId] = useState("");
  const [pgn, setPgn] = useState("");

  useEffect(() => {
    if (!gameId) return;
    const game = gameMap[gameId];
    if (game?.pgn) setPgn(game.pgn);
  }, [gameId, gameMap]);

  const { rows, error, fensByPly, uciMoves } = useUciRowsFromPgn(pgn);
  const maxPly = Math.max(0, fensByPly.length - 1);

  const [selectedPlyInitial, setSelectedPlyInitial] = useState(0);
  const [selectedPlyDisplay, setSelectedPlyDisplay] = useState(0);
  const [answerEndPly, setAnswerEndPly] = useState("1");

  useEffect(() => {
    setSelectedPlyInitial(maxPly);
    setSelectedPlyDisplay(maxPly);
    setAnswerEndPly(String(maxPly));
  }, [pgn, maxPly]);

  const safePlyInitial = Math.min(Math.max(0, selectedPlyInitial), maxPly);
  const safePlyDisplay = Math.min(Math.max(0, selectedPlyDisplay), maxPly);
  const answerEndPlyNum = Math.min(
    Math.max(safePlyDisplay + 1, parseInt(answerEndPly, 10) || safePlyDisplay + 1),
    maxPly,
  );
  const moveCountForAnswer = Math.max(1, answerEndPlyNum - safePlyDisplay);

  const initialFen = fensByPly[safePlyInitial] ?? START_FEN;
  const displayFen = fensByPly[safePlyDisplay] ?? START_FEN;
  const answerEndFen = fensByPly[answerEndPlyNum] ?? START_FEN;

  const derivedMoves = useMemo(() => {
    const trimmed = pgn.trim();
    if (!trimmed) return "";
    return (
      getUciMovesFromPgnAfterPlyAtMoveCount(trimmed, safePlyDisplay, moveCountForAnswer) ?? ""
    );
  }, [pgn, safePlyDisplay, moveCountForAnswer]);

  const setDisplayPlyFromBoard = (ply: number) => {
    const prevCount = Math.max(1, answerEndPlyNum - safePlyDisplay);
    setSelectedPlyDisplay(ply);
    setAnswerEndPly(String(Math.min(ply + prevCount, maxPly)));
  };

  const setAnswerEndPlyFromBoard = (endPly: number) => {
    if (endPly <= safePlyDisplay) {
      setSelectedPlyDisplay(endPly);
      setAnswerEndPly(String(Math.min(endPly + 1, maxPly)));
    } else {
      setAnswerEndPly(String(endPly));
    }
  };

  const canSubmit =
    Boolean(pgn.trim()) &&
    Boolean(derivedMoves.trim()) &&
    !error;

  return (
    <form action={createRiddleAction} className="max-w-[110rem] space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Game (optional)</FieldLabel>
          <select
            name="gameId"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className={cn(
              "border-input h-9 w-full max-w-md rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          >
            <option value="">None — use PGN below</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.whitePlayer} vs {g.blackPlayer} ({g.result})
              </option>
            ))}
          </select>
          <p className="text-muted-foreground mt-1 text-xs">
            Link a saved game to pre-fill PGN, or leave empty and paste a PGN directly.
          </p>
        </Field>
        <Field>
          <FieldLabel>PGN</FieldLabel>
          <textarea
            name="pgn"
            required
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            rows={6}
            placeholder="Paste PGN here…"
            spellCheck={false}
            className={cn(
              "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Answer length (half-moves)</FieldLabel>
          <input type="hidden" name="moveCountForAnswer" value={String(moveCountForAnswer)} />
          <Input
            type="number"
            min={1}
            value={String(moveCountForAnswer)}
            onChange={(e) => {
              const count = Math.max(1, parseInt(e.target.value, 10) || 1);
              setAnswerEndPly(String(Math.min(safePlyDisplay + count, maxPly)));
            }}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            UCI solution line runs from display ply through this many half-moves (right board end).
          </p>
        </Field>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" required placeholder="e.g. Find the best move" />
        </Field>
        <Field>
          <FieldLabel>Game Type</FieldLabel>
          <Input name="gameType" required placeholder="e.g. legend_games" />
        </Field>
        <Field>
          <FieldLabel>Themes</FieldLabel>
          <Input name="themes" placeholder="Comma-separated, e.g. tactics, endgame" />
        </Field>
        <Field className="flex flex-row items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked className="size-4 rounded border" />
          <FieldLabel className="mb-0">Active (visible on challenge pages)</FieldLabel>
        </Field>
        <Field>
          <FieldLabel>Goals (JSON)</FieldLabel>
          <textarea
            name="goals"
            rows={6}
            placeholder='[{"ply":1,"move":"e2e4","title":"...","description":"...","isCompleted":false}]'
            className={cn(
              "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
            )}
          />
        </Field>
      </FieldGroup>

      <input type="hidden" name="displayPly" value={String(safePlyDisplay)} />
      <input type="hidden" name="initialFen" value={initialFen} />
      <input type="hidden" name="displayFen" value={displayFen} />
      <input type="hidden" name="moves" value={derivedMoves} />

      {pgn.trim() ? (
        <>
          <div className="border-input bg-muted/30 rounded-md border p-3">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  initialFen (left)
                </p>
                <p className="font-mono text-xs break-all">{initialFen}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Ply: <span className="text-foreground font-mono tabular-nums">{safePlyInitial}</span>
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  displayFen (center)
                </p>
                <p className="font-mono text-xs break-all">{displayFen}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Ply: <span className="text-foreground font-mono tabular-nums">{safePlyDisplay}</span>
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  answer end (right)
                </p>
                <p className="font-mono text-xs break-all">{answerEndFen}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Ply: <span className="text-foreground font-mono tabular-nums">{answerEndPlyNum}</span>
                </p>
              </div>
            </div>
            <p className="text-muted-foreground border-border mt-3 border-t pt-3 text-[11px] leading-relaxed">
              For riddles, <span className="font-mono">initial_fen</span> and{" "}
              <span className="font-mono">display_fen</span> are usually the same ply (puzzle start). The
              solution UCI line is derived from display ply to the answer-end ply.
            </p>
          </div>
          <div className="grid gap-10 xl:grid-cols-2">
            <AdminPgnBoardPicker
              sourceId="new-riddle-initial"
              title="Left — initial_fen"
              boardFen={initialFen}
              rows={rows}
              error={error}
              uciMoves={uciMoves}
              safePly={safePlyInitial}
              maxPly={maxPly}
              setSelectedPly={setSelectedPlyInitial}
            />
            <AdminPgnBoardPicker
              sourceId="new-riddle-display"
              title="Right — display_fen"
              boardFen={displayFen}
              rows={rows}
              error={error}
              uciMoves={uciMoves}
              safePly={safePlyDisplay}
              maxPly={maxPly}
              setSelectedPly={setDisplayPlyFromBoard}
            />
          </div>
          <AdminPgnBoardPicker
            sourceId="new-riddle-answer-end"
            title="Answer end — solution line target"
            boardFen={answerEndFen}
            rows={rows}
            error={error}
            uciMoves={uciMoves}
            safePly={answerEndPlyNum}
            maxPly={maxPly}
            setSelectedPly={setAnswerEndPlyFromBoard}
          />
          <Field>
            <FieldLabel>Moves (UCI, derived)</FieldLabel>
            <Input readOnly value={derivedMoves} className="font-mono text-sm" />
          </Field>
        </>
      ) : (
        <p className="text-muted-foreground text-sm">Paste a PGN to pick positions on the boards.</p>
      )}

      <Button type="submit" disabled={!canSubmit}>
        Create riddle
      </Button>
      {!canSubmit && pgn.trim() && (
        <p className="text-muted-foreground text-xs">
          Provide a valid PGN and select display / answer positions so moves can be derived.
        </p>
      )}
    </form>
  );
}
